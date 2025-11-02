import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../../common/entities/base.entity';
import { RolePermission } from '../../role-permissions/entities/role-permission.entity';

@Entity('permissions')
export class Permission extends BaseEntity {
  @Column({ length: 100, unique: true })
  name: string;

  @Column({ length: 100, unique: true })
  slug: string;

  @Column({ length: 50 })
  resource: string;

  @Column({ length: 20 })
  action: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => RolePermission, rolePermission => rolePermission.permission)
  rolePermissions: RolePermission[];
}