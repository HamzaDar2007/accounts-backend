import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class SeedInitialData1703040000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Insert Permissions
    const permissions = [
      // User Management
      {
        name: 'users:create',
        description: 'Create users',
        resource: 'users',
        action: 'create',
      },
      {
        name: 'users:read',
        description: 'View users',
        resource: 'users',
        action: 'read',
      },
      {
        name: 'users:update',
        description: 'Update users',
        resource: 'users',
        action: 'update',
      },
      {
        name: 'users:delete',
        description: 'Delete users',
        resource: 'users',
        action: 'delete',
      },

      // Company Management
      {
        name: 'companies:read',
        description: 'View company',
        resource: 'companies',
        action: 'read',
      },
      {
        name: 'companies:update',
        description: 'Update company',
        resource: 'companies',
        action: 'update',
      },

      // Customer Management
      {
        name: 'customers:create',
        description: 'Create customers',
        resource: 'customers',
        action: 'create',
      },
      {
        name: 'customers:read',
        description: 'View customers',
        resource: 'customers',
        action: 'read',
      },
      {
        name: 'customers:update',
        description: 'Update customers',
        resource: 'customers',
        action: 'update',
      },
      {
        name: 'customers:delete',
        description: 'Delete customers',
        resource: 'customers',
        action: 'delete',
      },

      // Item Management
      {
        name: 'items:create',
        description: 'Create items',
        resource: 'items',
        action: 'create',
      },
      {
        name: 'items:read',
        description: 'View items',
        resource: 'items',
        action: 'read',
      },
      {
        name: 'items:update',
        description: 'Update items',
        resource: 'items',
        action: 'update',
      },
      {
        name: 'items:delete',
        description: 'Delete items',
        resource: 'items',
        action: 'delete',
      },

      // Invoice Management
      {
        name: 'invoices:create',
        description: 'Create invoices',
        resource: 'invoices',
        action: 'create',
      },
      {
        name: 'invoices:read',
        description: 'View invoices',
        resource: 'invoices',
        action: 'read',
      },
      {
        name: 'invoices:update',
        description: 'Update invoices',
        resource: 'invoices',
        action: 'update',
      },
      {
        name: 'invoices:delete',
        description: 'Delete invoices',
        resource: 'invoices',
        action: 'delete',
      },
      {
        name: 'invoices:send',
        description: 'Send invoices',
        resource: 'invoices',
        action: 'send',
      },

      // Payment Management
      {
        name: 'payments:create',
        description: 'Create payments',
        resource: 'payments',
        action: 'create',
      },
      {
        name: 'payments:read',
        description: 'View payments',
        resource: 'payments',
        action: 'read',
      },
      {
        name: 'payments:update',
        description: 'Update payments',
        resource: 'payments',
        action: 'update',
      },
      {
        name: 'payments:delete',
        description: 'Delete payments',
        resource: 'payments',
        action: 'delete',
      },

      // Reports
      {
        name: 'reports:view',
        description: 'View reports',
        resource: 'reports',
        action: 'view',
      },
      {
        name: 'reports:export',
        description: 'Export reports',
        resource: 'reports',
        action: 'export',
      },

      // Settings
      {
        name: 'settings:read',
        description: 'View settings',
        resource: 'settings',
        action: 'read',
      },
      {
        name: 'settings:update',
        description: 'Update settings',
        resource: 'settings',
        action: 'update',
      },
    ];

    for (const permission of permissions) {
      await queryRunner.query(
        `
        INSERT INTO permissions (name, description, resource, action)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (name) DO NOTHING
      `,
        [
          permission.name,
          permission.description,
          permission.resource,
          permission.action,
        ],
      );
    }

    // 2. Insert Roles
    const roles = [
      {
        name: 'Owner',
        description: 'Company owner with full access',
        is_system_role: true,
      },
      {
        name: 'Staff',
        description: 'Staff member with limited access',
        is_system_role: true,
      },
      {
        name: 'Accountant',
        description: 'Accountant with financial access',
        is_system_role: true,
      },
    ];

    for (const role of roles) {
      await queryRunner.query(
        `
        INSERT INTO roles (name, description, is_system_role)
        VALUES ($1, $2, $3)
        ON CONFLICT (name) DO NOTHING
      `,
        [role.name, role.description, role.is_system_role],
      );
    }

    // 3. Assign all permissions to Owner role
    await queryRunner.query(`
      INSERT INTO role_permissions (role_id, permission_id)
      SELECT r.id, p.id
      FROM roles r, permissions p
      WHERE r.name = 'Owner'
      ON CONFLICT (role_id, permission_id) DO NOTHING
    `);

    // 4. Assign limited permissions to Staff role
    const staffPermissions = [
      'customers:create',
      'customers:read',
      'customers:update',
      'items:create',
      'items:read',
      'items:update',
      'invoices:create',
      'invoices:read',
      'invoices:update',
      'invoices:send',
      'payments:create',
      'payments:read',
      'payments:update',
    ];

    for (const permName of staffPermissions) {
      await queryRunner.query(
        `
        INSERT INTO role_permissions (role_id, permission_id)
        SELECT r.id, p.id
        FROM roles r, permissions p
        WHERE r.name = 'Staff' AND p.name = $1
        ON CONFLICT (role_id, permission_id) DO NOTHING
      `,
        [permName],
      );
    }

    // 5. Assign accounting permissions to Accountant role
    const accountantPermissions = [
      'customers:read',
      'items:read',
      'invoices:create',
      'invoices:read',
      'invoices:update',
      'invoices:send',
      'payments:create',
      'payments:read',
      'payments:update',
      'reports:view',
      'reports:export',
    ];

    for (const permName of accountantPermissions) {
      await queryRunner.query(
        `
        INSERT INTO role_permissions (role_id, permission_id)
        SELECT r.id, p.id
        FROM roles r, permissions p
        WHERE r.name = 'Accountant' AND p.name = $1
        ON CONFLICT (role_id, permission_id) DO NOTHING
      `,
        [permName],
      );
    }

    // 6. Insert Sample Companies
    const companies = [
      {
        name: 'Al-Rashid Trading LLC',
        country: 'UAE',
        currency: 'AED',
        trn: '100000000000003',
        default_vat_rate: 5.0,
      },
      {
        name: 'Al-Saud Company Ltd',
        country: 'KSA',
        currency: 'SAR',
        trn: '300000000000003',
        default_vat_rate: 15.0,
      },
    ];

    const companyIds: string[] = [];
    for (const company of companies) {
      const existing = await queryRunner.query(
        `SELECT id FROM companies WHERE trn = $1 LIMIT 1`,
        [company.trn],
      );
      
      if (existing.length > 0) {
        companyIds.push(existing[0].id);
      } else {
        const result = await queryRunner.query(
          `
          INSERT INTO companies (name, country, currency, trn, vat_enabled, default_vat_rate)
          VALUES ($1, $2, $3, $4, true, $5)
          RETURNING id
        `,
          [
            company.name,
            company.country,
            company.currency,
            company.trn,
            company.default_vat_rate,
          ],
        );
        companyIds.push(result[0].id);
      }
    }

    // 7. Insert Company Settings
    for (const companyId of companyIds) {
      await queryRunner.query(
        `
        INSERT INTO company_settings (company_id, invoice_prefix, next_invoice_number)
        VALUES ($1, 'INV', 1)
        ON CONFLICT (company_id) DO NOTHING
      `,
        [companyId],
      );
    }

    // 8. Insert Sample Users
    const hashedPassword = await bcrypt.hash('password123', 10);
    const users = [
      {
        company_id: companyIds[0],
        email: 'owner@alrashid.ae',
        first_name: 'Ahmed',
        last_name: 'Al-Rashid',
        role: 'Owner',
        language: 'en',
      },
      {
        company_id: companyIds[0],
        email: 'staff@alrashid.ae',
        first_name: 'Sara',
        last_name: 'Mohammed',
        role: 'Staff',
        language: 'ar',
      },
      {
        company_id: companyIds[1],
        email: 'owner@alsaud.sa',
        first_name: 'Mohammed',
        last_name: 'Al-Saud',
        role: 'Owner',
        language: 'ar',
      },
    ];

    const userIds: string[] = [];
    for (const user of users) {
      const existing = await queryRunner.query(
        `SELECT id FROM users WHERE email = $1 LIMIT 1`,
        [user.email],
      );
      
      if (existing.length > 0) {
        userIds.push(existing[0].id);
      } else {
        const result = await queryRunner.query(
          `
          INSERT INTO users (company_id, email, password_hash, first_name, last_name, role, language)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING id
        `,
          [
            user.company_id,
            user.email,
            hashedPassword,
            user.first_name,
            user.last_name,
            user.role,
            user.language,
          ],
        );
        userIds.push(result[0].id);
      }
    }

    // 9. Insert Sample Customers
    const customers = [
      {
        company_id: companyIds[0],
        name: 'Emirates Steel Industries',
        email: 'procurement@emiratessteel.ae',
        phone: '+971501111111',
        trn: '100000000000004',
        billing_address_json: JSON.stringify({
          street: 'Industrial Area',
          city: 'Abu Dhabi',
          country: 'UAE'
        }),
        created_by: userIds[0],
        updated_by: userIds[0],
      },
      {
        company_id: companyIds[0],
        name: 'Dubai Mall Retail',
        email: 'orders@dubaimall.ae',
        phone: '+971502222222',
        trn: '100000000000005',
        billing_address_json: JSON.stringify({
          street: 'Downtown Dubai',
          city: 'Dubai',
          country: 'UAE'
        }),
        created_by: userIds[0],
        updated_by: userIds[0],
      },
      {
        company_id: companyIds[1],
        name: 'Saudi Aramco Services',
        email: 'procurement@aramco.sa',
        phone: '+966503333333',
        trn: '300000000000004',
        billing_address_json: JSON.stringify({
          street: 'Dhahran',
          city: 'Eastern Province',
          country: 'KSA'
        }),
        created_by: userIds[2],
        updated_by: userIds[2],
      },
      {
        company_id: companyIds[1],
        name: 'Riyadh Construction Co.',
        email: 'projects@riyadhconstruction.sa',
        phone: '+966504444444',
        trn: '300000000000005',
        billing_address_json: JSON.stringify({
          street: 'King Abdulaziz Road',
          city: 'Riyadh',
          country: 'KSA'
        }),
        created_by: userIds[2],
        updated_by: userIds[2],
      },
    ];

    const customerIds: string[] = [];
    for (const customer of customers) {
      const result = await queryRunner.query(
        `
        INSERT INTO customers (company_id, name, email, phone, trn, billing_address_json, created_by, updated_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id
      `,
        [
          customer.company_id,
          customer.name,
          customer.email,
          customer.phone,
          customer.trn,
          customer.billing_address_json,
          customer.created_by,
          customer.updated_by,
        ],
      );
      customerIds.push(result[0].id);
    }

    // 10. Insert Sample Items
    const items = [
      {
        company_id: companyIds[0],
        sku: 'STEEL-001',
        name: 'Steel Rebar 12mm',
        name_ar: 'حديد التسليح 12 مم',
        description: 'High quality steel rebar for construction',
        description_ar: 'حديد تسليح عالي الجودة للبناء',
        unit_price: 25.5,
        unit_cost: 20.0,
        created_by: userIds[0],
        updated_by: userIds[0],
      },
      {
        company_id: companyIds[1],
        sku: 'OIL-001',
        name: 'Motor Oil 5W-30',
        name_ar: 'زيت محرك 5W-30',
        description: 'Synthetic motor oil for vehicles',
        description_ar: 'زيت محرك صناعي للمركبات',
        unit_price: 45.0,
        unit_cost: 35.0,
        created_by: userIds[2],
        updated_by: userIds[2],
      },
    ];

    const itemIds: string[] = [];
    for (const item of items) {
      const result = await queryRunner.query(
        `
        INSERT INTO items (company_id, sku, name, name_ar, description, description_ar, unit_price, unit_cost, created_by, updated_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id
      `,
        [
          item.company_id,
          item.sku,
          item.name,
          item.name_ar,
          item.description,
          item.description_ar,
          item.unit_price,
          item.unit_cost,
          item.created_by,
          item.updated_by,
        ],
      );
      itemIds.push(result[0].id);
    }

    // 11. Insert Sample Invoices
    const invoices = [
      {
        company_id: companyIds[0],
        customer_id: customerIds[0],
        number: 'UAE-INV-001',
        issue_date: '2024-01-15',
        due_date: '2024-02-14',
        status: 'Sent',
        currency: 'AED',
        subtotal: 1000.0,
        tax_total: 50.0,
        total: 1050.0,
        total_paid: 0.0,
        balance_due: 1050.0,
        notes: 'Thank you for your business',
        created_by: userIds[0],
        updated_by: userIds[0],
      },
      {
        company_id: companyIds[1],
        customer_id: customerIds[2],
        number: 'KSA-INV-001',
        issue_date: '2024-01-15',
        due_date: '2024-02-14',
        status: 'Paid',
        currency: 'SAR',
        subtotal: 2000.0,
        tax_total: 300.0,
        total: 2300.0,
        total_paid: 2300.0,
        balance_due: 0.0,
        notes: 'Paid in full',
        created_by: userIds[2],
        updated_by: userIds[2],
      },
    ];

    const invoiceIds: string[] = [];
    for (const invoice of invoices) {
      const existing = await queryRunner.query(
        `SELECT id FROM invoices WHERE number = $1 LIMIT 1`,
        [invoice.number],
      );
      
      if (existing.length > 0) {
        invoiceIds.push(existing[0].id);
      } else {
        const result = await queryRunner.query(
          `
          INSERT INTO invoices (company_id, customer_id, number, issue_date, due_date, status, currency, subtotal, tax_total, total, total_paid, balance_due, notes, created_by, updated_by)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $14)
          RETURNING id
        `,
          [
            invoice.company_id,
            invoice.customer_id,
            invoice.number,
            invoice.issue_date,
            invoice.due_date,
            invoice.status,
            invoice.currency,
            invoice.subtotal,
            invoice.tax_total,
            invoice.total,
            invoice.total_paid,
            invoice.balance_due,
            invoice.notes,
            invoice.created_by,
          ],
        );
        invoiceIds.push(result[0].id);
      }
    }

    // 12. Insert Sample Invoice Lines
    const invoiceLines = [
      {
        invoice_id: invoiceIds[0],
        item_id: itemIds[0],
        description: 'Steel Rebar 12mm',
        description_ar: 'حديد التسليح 12 مم',
        quantity: 20,
        unit_price: 25.5,
        discount_amount: 10.0,
        tax_rate_percent: 5.0,
        line_subtotal: 500.0,
        tax_amount: 25.0,
        line_total: 525.0,
      },
      {
        invoice_id: invoiceIds[1],
        item_id: itemIds[1],
        description: 'Motor Oil 5W-30',
        description_ar: 'زيت محرك 5W-30',
        quantity: 30,
        unit_price: 45.0,
        discount_amount: 50.0,
        tax_rate_percent: 15.0,
        line_subtotal: 1300.0,
        tax_amount: 195.0,
        line_total: 1495.0,
      },
    ];

    for (const line of invoiceLines) {
      await queryRunner.query(
        `
        INSERT INTO invoice_lines (invoice_id, item_id, description, description_ar, quantity, unit_price, discount_amount, tax_rate_percent, line_subtotal, tax_amount, line_total)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `,
        [
          line.invoice_id,
          line.item_id,
          line.description,
          line.description_ar,
          line.quantity,
          line.unit_price,
          line.discount_amount,
          line.tax_rate_percent,
          line.line_subtotal,
          line.tax_amount,
          line.line_total,
        ],
      );
    }

    // 13. Insert Sample Payments
    const payments = [
      {
        company_id: companyIds[1],
        invoice_id: invoiceIds[1],
        received_on: '2024-01-18',
        amount: 2300.0,
        method: 'bank',
        reference: 'TXN-002-2024',
        notes: 'Full payment received via bank transfer',
        created_by: userIds[2],
        updated_by: userIds[2],
      },
    ];

    for (const payment of payments) {
      await queryRunner.query(
        `
        INSERT INTO payments (company_id, invoice_id, received_on, amount, method, reference, notes, created_by, updated_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `,
        [
          payment.company_id,
          payment.invoice_id,
          payment.received_on,
          payment.amount,
          payment.method,
          payment.reference,
          payment.notes,
          payment.created_by,
          payment.updated_by,
        ],
      );
    }

    console.log('✅ Seed data inserted successfully');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM payments');
    await queryRunner.query('DELETE FROM invoice_lines');
    await queryRunner.query('DELETE FROM invoices');
    await queryRunner.query('DELETE FROM items');
    await queryRunner.query('DELETE FROM customers');
    await queryRunner.query('DELETE FROM users');
    await queryRunner.query('DELETE FROM company_settings');
    await queryRunner.query('DELETE FROM companies');
    await queryRunner.query('DELETE FROM role_permissions');
    await queryRunner.query('DELETE FROM permissions');
    await queryRunner.query('DELETE FROM roles');
  }
}
