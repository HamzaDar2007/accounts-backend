import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { RolePermission } from './role-permission.entity';

@Entity('permissions')
export class Permission extends BaseEntity {
  @Column({ length: 100, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 50 })
  resource: string;

  @Column({ length: 50 })
  action: string;

  @OneToMany(() => RolePermission, rolePermission => rolePermission.permission)
  roles: RolePermission[];
}