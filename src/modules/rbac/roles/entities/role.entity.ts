import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../../common/entities/base.entity';
import { RolePermission } from '../../role-permissions/entities/role-permission.entity';

@Entity('roles')
export class Role extends BaseEntity {
  @Column({ length: 100, unique: true })
  name: string;

  @Column({ length: 100, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'is_system', default: false })
  isSystem: boolean;

  @OneToMany(() => RolePermission, rolePermission => rolePermission.role)
  rolePermissions: RolePermission[];
}