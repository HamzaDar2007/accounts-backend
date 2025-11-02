import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { User } from '../users/entities/user.entity';
import { Company } from '../companies/entities/company.entity';
import { CompanySettings } from '../companies/entities/company-settings.entity';
import { TokenBlacklistService } from './services/token-blacklist.service';
import { CountryConfigService } from '../../common/services/country-config.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Company, CompanySettings]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET')!,
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN')! as any,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, CountryConfigService, TokenBlacklistService],
  exports: [AuthService],
})
export class AuthModule {}
