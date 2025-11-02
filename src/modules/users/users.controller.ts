import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { UserRole } from '../../common/enums/country.enum';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Create new user (Owner only)' })
  @ApiBody({ 
    type: CreateUserDto,
    examples: {
      staff: {
        summary: 'Create Staff User',
        value: {
          email: 'staff@company.com',
          password: 'StaffPass123!',
          firstName: 'Sara',
          lastName: 'Ahmed',
          role: 'staff',
          phone: '+971501234568',
          preferredLanguage: 'en'
        }
      },
      accountant: {
        summary: 'Create Accountant User',
        value: {
          email: 'accountant@company.com',
          password: 'AccPass123!',
          firstName: 'Omar',
          lastName: 'Hassan',
          role: 'accountant',
          phone: '+971501234569',
          preferredLanguage: 'ar'
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 403, description: 'Forbidden - Owner role required' })
  create(
    @Body() createUserDto: CreateUserDto,
    @CurrentTenant() companyId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.usersService.create(createUserDto, companyId, user.role);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users in company' })
  @ApiResponse({ status: 200, description: 'Users list returned successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@CurrentTenant() companyId: string) {
    return this.usersService.findAll(companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User returned successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string, @CurrentTenant() companyId: string) {
    return this.usersService.findOne(id, companyId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiBody({ 
    type: UpdateUserDto,
    examples: {
      update: {
        summary: 'Update User',
        value: {
          firstName: 'Sara Updated',
          phone: '+971509876543',
          preferredLanguage: 'ar'
        }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentTenant() companyId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.usersService.update(id, updateUserDto, companyId, user.role);
  }

  @Delete(':id')
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Deactivate user (Owner only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User deactivated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Owner role required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(
    @Param('id') id: string,
    @CurrentTenant() companyId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.usersService.remove(id, companyId, user.role);
  }

  @Patch(':id/role')
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Change user role (Owner only)' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiBody({ 
    schema: { 
      type: 'object', 
      properties: { 
        role: { type: 'string', enum: ['owner', 'staff', 'accountant'] } 
      },
      required: ['role']
    },
    examples: {
      promote: {
        summary: 'Promote to Accountant',
        value: { role: 'accountant' }
      },
      demote: {
        summary: 'Change to Staff',
        value: { role: 'staff' }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'User role changed successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Owner role required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  changeRole(
    @Param('id') id: string,
    @Body() body: { role: UserRole },
    @CurrentTenant() companyId: string,
  ) {
    return this.usersService.changeRole(id, body.role, companyId);
  }
}