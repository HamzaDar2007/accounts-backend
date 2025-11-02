export const PERMISSIONS = {
  // User Management
  USERS_CREATE: 'users:create',
  USERS_READ: 'users:read',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',

  // Company Management
  COMPANY_READ: 'company:read',
  COMPANY_UPDATE: 'company:update',
  COMPANY_SETTINGS: 'company:settings',

  // Invoice Management
  INVOICES_CREATE: 'invoices:create',
  INVOICES_READ: 'invoices:read',
  INVOICES_UPDATE: 'invoices:update',
  INVOICES_DELETE: 'invoices:delete',
  INVOICES_SEND: 'invoices:send',

  // Customer Management
  CUSTOMERS_CREATE: 'customers:create',
  CUSTOMERS_READ: 'customers:read',
  CUSTOMERS_UPDATE: 'customers:update',
  CUSTOMERS_DELETE: 'customers:delete',

  // Product Management
  PRODUCTS_CREATE: 'products:create',
  PRODUCTS_READ: 'products:read',
  PRODUCTS_UPDATE: 'products:update',
  PRODUCTS_DELETE: 'products:delete',

  // Reports
  REPORTS_VIEW: 'reports:view',
  REPORTS_EXPORT: 'reports:export',

  // RBAC
  ROLES_MANAGE: 'roles:manage',
  PERMISSIONS_MANAGE: 'permissions:manage'
};

export const ROLE_PERMISSIONS = {
  Owner: Object.values(PERMISSIONS),
  Staff: [
    PERMISSIONS.INVOICES_CREATE,
    PERMISSIONS.INVOICES_READ,
    PERMISSIONS.INVOICES_UPDATE,
    PERMISSIONS.CUSTOMERS_CREATE,
    PERMISSIONS.CUSTOMERS_READ,
    PERMISSIONS.CUSTOMERS_UPDATE,
    PERMISSIONS.PRODUCTS_CREATE,
    PERMISSIONS.PRODUCTS_READ,
    PERMISSIONS.PRODUCTS_UPDATE,
    PERMISSIONS.REPORTS_VIEW
  ],
  Accountant: [
    PERMISSIONS.INVOICES_CREATE,
    PERMISSIONS.INVOICES_READ,
    PERMISSIONS.INVOICES_UPDATE,
    PERMISSIONS.INVOICES_SEND,
    PERMISSIONS.CUSTOMERS_READ,
    PERMISSIONS.PRODUCTS_READ,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_EXPORT
  ]
};