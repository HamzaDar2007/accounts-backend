import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UserRole } from '../../common/enums/country.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from '../users/entities/user.entity';
import { Company } from '../companies/entities/company.entity';
import { CompanySettings } from '../companies/entities/company-settings.entity';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CountryConfigService } from '../../common/services/country-config.service';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { TokenBlacklistService } from './services/token-blacklist.service';

@Injectable()
export class AuthService {
  private resetTokens = new Map<string, { userId: string; expires: Date }>();

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(CompanySettings)
    private companySettingsRepository: Repository<CompanySettings>,

    private jwtService: JwtService,
    private configService: ConfigService,
    private countryConfigService: CountryConfigService,
    private dataSource: DataSource,
    private tokenBlacklistService: TokenBlacklistService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const countryConfig = this.countryConfigService.getCountryConfig(
      registerDto.country,
    );

    // Use transaction to ensure data consistency
    return await this.dataSource.transaction(async manager => {
      // Create company first without owner
      const company = manager.create(Company, {
        name: registerDto.companyName,
        nameEn: registerDto.companyName,
        country: registerDto.country,
        currency: countryConfig.currencyCode,
        vatRate: countryConfig.defaultVatRate,
        taxRegistrationNumber: registerDto.trn,
        addressEn: registerDto.address,
      });

      const savedCompany = await manager.save(Company, company);

      // Create company settings
      const companySettings = manager.create(CompanySettings, {
        companyId: savedCompany.id,
      });
      await manager.save(CompanySettings, companySettings);

      // Create user with company ID
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      
      const user = manager.create(User, {
        companyId: savedCompany.id,
        email: registerDto.email,
        passwordHash: hashedPassword,
        role: UserRole.OWNER,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        preferredLanguage: registerDto.language,
      });

      const savedUser = await manager.save(User, user);

      // Owner relationship handled by user role

      // Phone stored directly in user entity
      if (registerDto.phone) {
        savedUser.phone = registerDto.phone;
        await manager.save(User, savedUser);
      }

      const payload: JwtPayload = {
        sub: savedUser.id,
        email: savedUser.email,
        companyId: savedUser.companyId,
        role: savedUser.role,
        language: savedUser.preferredLanguage,
      };

      const accessToken = this.jwtService.sign(payload);
      const refreshToken = this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
      });

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: {
          id: savedUser.id,
          email: savedUser.email,
          firstName: savedUser.firstName,
          lastName: savedUser.lastName,
          role: savedUser.role,
          company: {
            id: savedCompany.id,
            name: savedCompany.name,
            country: savedCompany.country,
          },
        },
      };
    });
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email, isActive: true },
      relations: ['company'],
    });

    if (
      !user ||
      !(await bcrypt.compare(loginDto.password, user.passwordHash))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Login tracking removed from entity

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      companyId: user.companyId,
      role: user.role,
      language: user.preferredLanguage,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        company: {
          id: user.company.id,
          name: user.company.name,
          country: user.company.country,
        },
      },
    };
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['company'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      language: user.preferredLanguage,
      company: {
        id: user.company.id,
        name: user.company.name,
        country: user.company.country,
        currency: user.company.currency,
      },
      phone: user.phone,
    };
  }

  async refresh(refreshToken: string) {
    try {
      // Check if refresh token is blacklisted
      if (this.tokenBlacklistService.isTokenBlacklisted(refreshToken)) {
        throw new UnauthorizedException('Refresh token has been revoked');
      }

      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const user = await this.userRepository.findOne({
        where: { id: payload.sub, isActive: true },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Blacklist the old refresh token
      this.tokenBlacklistService.blacklistToken(refreshToken);

      const newPayload: JwtPayload = {
        sub: user.id,
        email: user.email,
        companyId: user.companyId,
        role: user.role,
        language: user.preferredLanguage,
      };

      const newAccessToken = this.jwtService.sign(newPayload);
      const newRefreshToken = this.jwtService.sign(newPayload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
      });

      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findOne({
      where: { email, isActive: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

    this.resetTokens.set(resetToken, {
      userId: user.id,
      expires: expiresAt,
    });

    return {
      message: 'Password reset token generated',
      resetToken,
      expiresAt,
    };
  }

  async resetPassword(token: string, password: string) {
    const tokenData = this.resetTokens.get(token);

    if (!tokenData || tokenData.expires < new Date()) {
      this.resetTokens.delete(token);
      throw new BadRequestException('Invalid or expired reset token');
    }

    const user = await this.userRepository.findOne({
      where: { id: tokenData.userId, isActive: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.passwordHash = hashedPassword;
    await this.userRepository.save(user);

    this.resetTokens.delete(token);

    return {
      message: 'Password reset successfully',
    };
  }

  async verifyEmail(token: string) {
    return { message: 'Email verified successfully' };
  }

  async logout(userId: string, accessToken?: string, refreshToken?: string) {
    // Blacklist both access and refresh tokens
    if (accessToken) {
      this.tokenBlacklistService.blacklistToken(accessToken);
    }
    
    if (refreshToken) {
      this.tokenBlacklistService.blacklistToken(refreshToken);
    }
    
    // In a production environment, you would typically:
    // 1. Store blacklisted tokens in Redis or database with TTL equal to token expiry
    // 2. Clear all refresh tokens for this user from persistent storage
    // 3. Log the logout event for security auditing
    
    return {
      message: 'Logged out successfully',
      timestamp: new Date().toISOString(),
      tokensInvalidated: {
        accessToken: !!accessToken,
        refreshToken: !!refreshToken
      }
    };
  }
}