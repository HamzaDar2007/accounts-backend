import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { RbacService } from './rbac.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/country.enum';

@ApiTags('RBAC')
@ApiBearerAuth('JWT-auth')
@Controller('rbac')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RbacController {
  constructor(private readonly rbacService: RbacService) {}

  @Get('roles')
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({ status: 200, description: 'Roles list returned successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getRoles() {
    return this.rbacService.getRoles();
  }

  @Get('permissions')
  @ApiOperation({ summary: 'Get all permissions' })
  @ApiResponse({ status: 200, description: 'Permissions list returned successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getPermissions() {
    return this.rbacService.getPermissions();
  }

  @Post('roles')
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Create new role (Owner only)' })
  @ApiBody({ type: CreateRoleDto })
  @ApiResponse({ status: 201, description: 'Role created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Owner role required' })
  createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.rbacService.createRole(createRoleDto);
  }

  @Patch('roles/:id/permissions')
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Assign permissions to role (Owner only)' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiBody({ type: AssignPermissionsDto })
  @ApiResponse({ status: 200, description: 'Permissions assigned successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Owner role required' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  assignPermissions(
    @Param('id') roleId: string,
    @Body() assignPermissionsDto: AssignPermissionsDto,
  ) {
    return this.rbacService.assignPermissions(roleId, assignPermissionsDto.permissionIds);
  }
}