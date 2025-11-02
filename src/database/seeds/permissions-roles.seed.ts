import { DataSource } from 'typeorm';
import { Permission } from '../../modules/rbac/entities/permission.entity';
import { Role } from '../../modules/rbac/entities/role.entity';
import { RolePermission } from '../../modules/rbac/entities/role-permission.entity';
import { PERMISSIONS } from '../../shared/constants/permissions.constant';

export async function seedPermissionsAndRoles(dataSource: DataSource) {
  const permissionRepository = dataSource.getRepository(Permission);
  const roleRepository = dataSource.getRepository(Role);
  const rolePermissionRepository = dataSource.getRepository(RolePermission);

  // Permission definitions with bilingual descriptions
  const permissionData = [
    { name: PERMISSIONS.USERS_CREATE, resource: 'users', action: 'create', description: JSON.stringify({ en: 'Create new users', ar: 'إنشاء مستخدمين جدد' }) },
    { name: PERMISSIONS.USERS_READ, resource: 'users', action: 'read', description: JSON.stringify({ en: 'View users', ar: 'عرض المستخدمين' }) },
    { name: PERMISSIONS.USERS_UPDATE, resource: 'users', action: 'update', description: JSON.stringify({ en: 'Update user information', ar: 'تحديث معلومات المستخدم' }) },
    { name: PERMISSIONS.USERS_DELETE, resource: 'users', action: 'delete', description: JSON.stringify({ en: 'Delete users', ar: 'حذف المستخدمين' }) },
    { name: PERMISSIONS.COMPANY_READ, resource: 'company', action: 'read', description: JSON.stringify({ en: 'View company information', ar: 'عرض معلومات الشركة' }) },
    { name: PERMISSIONS.COMPANY_UPDATE, resource: 'company', action: 'update', description: JSON.stringify({ en: 'Update company information', ar: 'تحديث معلومات الشركة' }) },
    { name: PERMISSIONS.COMPANY_SETTINGS, resource: 'company', action: 'settings', description: JSON.stringify({ en: 'Manage company settings', ar: 'إدارة إعدادات الشركة' }) },
    { name: PERMISSIONS.INVOICES_CREATE, resource: 'invoices', action: 'create', description: JSON.stringify({ en: 'Create invoices', ar: 'إنشاء الفواتير' }) },
    { name: PERMISSIONS.INVOICES_READ, resource: 'invoices', action: 'read', description: JSON.stringify({ en: 'View invoices', ar: 'عرض الفواتير' }) },
    { name: PERMISSIONS.INVOICES_UPDATE, resource: 'invoices', action: 'update', description: JSON.stringify({ en: 'Update invoices', ar: 'تحديث الفواتير' }) },
    { name: PERMISSIONS.INVOICES_DELETE, resource: 'invoices', action: 'delete', description: JSON.stringify({ en: 'Delete invoices', ar: 'حذف الفواتير' }) },
    { name: PERMISSIONS.INVOICES_SEND, resource: 'invoices', action: 'send', description: JSON.stringify({ en: 'Send invoices to customers', ar: 'إرسال الفواتير للعملاء' }) },
    { name: PERMISSIONS.CUSTOMERS_CREATE, resource: 'customers', action: 'create', description: JSON.stringify({ en: 'Create customers', ar: 'إنشاء العملاء' }) },
    { name: PERMISSIONS.CUSTOMERS_READ, resource: 'customers', action: 'read', description: JSON.stringify({ en: 'View customers', ar: 'عرض العملاء' }) },
    { name: PERMISSIONS.CUSTOMERS_UPDATE, resource: 'customers', action: 'update', description: JSON.stringify({ en: 'Update customer information', ar: 'تحديث معلومات العملاء' }) },
    { name: PERMISSIONS.CUSTOMERS_DELETE, resource: 'customers', action: 'delete', description: JSON.stringify({ en: 'Delete customers', ar: 'حذف العملاء' }) },
    { name: PERMISSIONS.PRODUCTS_CREATE, resource: 'products', action: 'create', description: JSON.stringify({ en: 'Create products/services', ar: 'إنشاء المنتجات/الخدمات' }) },
    { name: PERMISSIONS.PRODUCTS_READ, resource: 'products', action: 'read', description: JSON.stringify({ en: 'View products/services', ar: 'عرض المنتجات/الخدمات' }) },
    { name: PERMISSIONS.PRODUCTS_UPDATE, resource: 'products', action: 'update', description: JSON.stringify({ en: 'Update products/services', ar: 'تحديث المنتجات/الخدمات' }) },
    { name: PERMISSIONS.PRODUCTS_DELETE, resource: 'products', action: 'delete', description: JSON.stringify({ en: 'Delete products/services', ar: 'حذف المنتجات/الخدمات' }) },
    { name: PERMISSIONS.REPORTS_VIEW, resource: 'reports', action: 'view', description: JSON.stringify({ en: 'View reports', ar: 'عرض التقارير' }) },
    { name: PERMISSIONS.REPORTS_EXPORT, resource: 'reports', action: 'export', description: JSON.stringify({ en: 'Export reports', ar: 'تصدير التقارير' }) },
    { name: PERMISSIONS.ROLES_MANAGE, resource: 'roles', action: 'manage', description: JSON.stringify({ en: 'Manage user roles', ar: 'إدارة أدوار المستخدمين' }) },
    { name: PERMISSIONS.PERMISSIONS_MANAGE, resource: 'permissions', action: 'manage', description: JSON.stringify({ en: 'Manage permissions', ar: 'إدارة الصلاحيات' }) }
  ];

  // Role definitions with bilingual descriptions
  const roleData = [
    {
      name: 'Owner',
      description: JSON.stringify({
        en: 'Company owner with full access to all features',
        ar: 'مالك الشركة مع صلاحية كاملة لجميع الميزات'
      })
    },
    {
      name: 'Staff',
      description: JSON.stringify({
        en: 'Staff member with access to invoices, customers, and products',
        ar: 'موظف مع صلاحية الوصول للفواتير والعملاء والمنتجات'
      })
    },
    {
      name: 'Accountant',
      description: JSON.stringify({
        en: 'Accountant with access to invoices and reports',
        ar: 'محاسب مع صلاحية الوصول للفواتير والتقارير'
      })
    }
  ];

  console.log('🌱 Seeding permissions...');
  
  // Create permissions
  const permissions: Permission[] = [];
  for (const permData of permissionData) {
    let permission = await permissionRepository.findOne({ where: { name: permData.name } });
    if (!permission) {
      permission = permissionRepository.create(permData);
      await permissionRepository.save(permission);
    }
    permissions.push(permission);
  }

  console.log('🌱 Seeding roles...');
  
  // Create roles
  const roles: Role[] = [];
  for (const roleInfo of roleData) {
    let role = await roleRepository.findOne({ where: { name: roleInfo.name } });
    if (!role) {
      role = roleRepository.create(roleInfo);
      await roleRepository.save(role);
    }
    roles.push(role);
  }

  console.log('🌱 Assigning permissions to Owner role...');
  
  // Assign all permissions to Owner role
  const ownerRole = roles.find(role => role.name === 'Owner');
  if (ownerRole) {
    for (const permission of permissions) {
      const existingRolePermission = await rolePermissionRepository.findOne({
        where: { roleId: ownerRole.id, permissionId: permission.id }
      });
      
      if (!existingRolePermission) {
        const rolePermission = rolePermissionRepository.create({
          roleId: ownerRole.id,
          permissionId: permission.id
        });
        await rolePermissionRepository.save(rolePermission);
      }
    }
  }

  console.log('✅ Permissions and roles seeded successfully!');
  console.log(`📊 Created ${permissions.length} permissions and ${roles.length} roles`);
}