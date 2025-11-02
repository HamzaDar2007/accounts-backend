import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '../../common/enums/country.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

  ) {}

  async create(createUserDto: CreateUserDto, companyId: string, currentUserRole: UserRole) {
    try {
      if (currentUserRole !== UserRole.OWNER) {
        throw new ForbiddenException('Only owners can create users');
      }

      const existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email, companyId },
      });

      if (existingUser) {
        throw new ConflictException('User with this email already exists in your company');
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const user = this.userRepository.create({
        email: createUserDto.email,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        role: createUserDto.role,
        preferredLanguage: createUserDto.preferredLanguage,
        phone: createUserDto.phone,
        companyId,
        passwordHash: hashedPassword,
      });

      const savedUser = await this.userRepository.save(user);

      const { passwordHash, ...result } = savedUser;
      return result;
    } catch (error) {
      if (error instanceof ForbiddenException || error instanceof ConflictException) {
        throw error;
      }
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async findAll(companyId: string) {
    const users = await this.userRepository.find({
      where: { companyId },
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'preferredLanguage', 'isActive', 'phone', 'createdAt'],
    });

    return users;
  }

  async findOne(id: string, companyId: string) {
    const user = await this.userRepository.findOne({
      where: { id, companyId },
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'preferredLanguage', 'isActive', 'phone', 'createdAt'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto, companyId: string, currentUserRole: UserRole) {
    try {
      const user = await this.userRepository.findOne({
        where: { id, companyId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (updateUserDto.role && currentUserRole !== UserRole.OWNER) {
        throw new ForbiddenException('Only owners can change user roles');
      }

      // Safe property assignment
      if (updateUserDto.firstName !== undefined) user.firstName = updateUserDto.firstName;
      if (updateUserDto.lastName !== undefined) user.lastName = updateUserDto.lastName;
      if (updateUserDto.preferredLanguage !== undefined) user.preferredLanguage = updateUserDto.preferredLanguage;
      if (updateUserDto.phone !== undefined) user.phone = updateUserDto.phone;
      if (updateUserDto.role !== undefined) user.role = updateUserDto.role;
      
      const savedUser = await this.userRepository.save(user);

      const { passwordHash, ...result } = savedUser;
      return result;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  async remove(id: string, companyId: string, currentUserRole: UserRole) {
    try {
      if (currentUserRole !== UserRole.OWNER) {
        throw new ForbiddenException('Only owners can deactivate users');
      }

      const user = await this.userRepository.findOne({
        where: { id, companyId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      user.isActive = false;
      await this.userRepository.save(user);

      return { message: 'User deactivated successfully' };
    } catch (error) {
      if (error instanceof ForbiddenException || error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to deactivate user: ${error.message}`);
    }
  }

  async changeRole(id: string, role: UserRole, companyId: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id, companyId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      user.role = role;
      await this.userRepository.save(user);

      return { message: 'User role updated successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to change user role: ${error.message}`);
    }
  }
}