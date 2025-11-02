import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { RolePermission } from './entities/role-permission.entity';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RbacService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(RolePermission)
    private rolePermissionRepository: Repository<RolePermission>,
  ) {}

  async getRoles() {
    return this.roleRepository.find({
      relations: ['permissions'],
    });
  }

  async getPermissions() {
    return this.permissionRepository.find();
  }

  async createRole(createRoleDto: CreateRoleDto) {
    const role = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }

  async assignPermissions(roleId: string, permissionIds: string[]) {
    // Remove existing permissions
    await this.rolePermissionRepository.delete({ roleId });

    // Add new permissions
    const rolePermissions = permissionIds.map(permissionId => ({
      roleId,
      permissionId,
    }));

    return this.rolePermissionRepository.save(rolePermissions);
  }
}