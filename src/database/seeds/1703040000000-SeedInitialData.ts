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
        name_en: 'Al-Rashid Trading LLC',
        name_ar: 'شركة الراشد للتجارة ذ.م.م',
        country: 'UAE',
        currency: 'AED',
        vat_rate: 5,
        tax_registration_number: '100000000000003',
        address_en: '123 Business Bay, Dubai, UAE',
        address_ar: '123 خليج الأعمال، دبي، الإمارات',
        phone: '+971501234567',
        email: 'info@alrashid.ae',
      },
      {
        name: 'Al-Saud Company Ltd',
        name_en: 'Al-Saud Company Ltd',
        name_ar: 'شركة آل سعود المحدودة',
        country: 'KSA',
        currency: 'SAR',
        vat_rate: 15,
        tax_registration_number: '300000000000003',
        address_en: 'King Fahd Road, Riyadh, KSA',
        address_ar: 'طريق الملك فهد، الرياض، السعودية',
        phone: '+966501234567',
        email: 'info@alsaud.sa',
      },
    ];

    const companyIds: string[] = [];
    for (const company of companies) {
      // Check if company already exists
      const existing = await queryRunner.query(
        `
        SELECT id FROM companies WHERE email = $1 LIMIT 1
      `,
        [company.email],
      );

      if (existing.length > 0) {
        companyIds.push(existing[0].id);
      } else {
        const result = await queryRunner.query(
          `
          INSERT INTO companies (name, name_en, name_ar, country, currency, vat_rate, tax_registration_number, address_en, address_ar, phone, email)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          RETURNING id
        `,
          [
            company.name,
            company.name_en,
            company.name_ar,
            company.country,
            company.currency,
            company.vat_rate,
            company.tax_registration_number,
            company.address_en,
            company.address_ar,
            company.phone,
            company.email,
          ],
        );
        companyIds.push(result[0].id);
      }
    }

    // 7. Insert Company Settings
    for (const companyId of companyIds) {
      await queryRunner.query(
        `
        INSERT INTO company_settings (company_id, invoice_prefix, next_invoice_number, default_payment_terms)
        VALUES ($1, 'INV', 1, 30)
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
        phone: '+971501234567',
        preferred_language: 'en',
      },
      {
        company_id: companyIds[0],
        email: 'staff@alrashid.ae',
        first_name: 'Sara',
        last_name: 'Mohammed',
        role: 'Staff',
        phone: '+971501234568',
        preferred_language: 'ar',
      },
      {
        company_id: companyIds[1],
        email: 'owner@alsaud.sa',
        first_name: 'Mohammed',
        last_name: 'Al-Saud',
        role: 'Owner',
        phone: '+966501234567',
        preferred_language: 'ar',
      },
      {
        company_id: companyIds[1],
        email: 'accountant@alsaud.sa',
        first_name: 'Fatima',
        last_name: 'Al-Zahra',
        role: 'Accountant',
        phone: '+966501234568',
        preferred_language: 'ar',
      },
    ];

    const userIds: string[] = [];
    for (const user of users) {
      // Check if user already exists
      const existing = await queryRunner.query(
        `
        SELECT id FROM users WHERE email = $1 LIMIT 1
      `,
        [user.email],
      );

      if (existing.length > 0) {
        userIds.push(existing[0].id);
      } else {
        const result = await queryRunner.query(
          `
          INSERT INTO users (company_id, email, password_hash, first_name, last_name, role, phone, preferred_language)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING id
        `,
          [
            user.company_id,
            user.email,
            hashedPassword,
            user.first_name,
            user.last_name,
            user.role,
            user.phone,
            user.preferred_language,
          ],
        );
        userIds.push(result[0].id);
      }
    }

    // 9. Insert Sample Customers
    const customers = [
      {
        company_id: companyIds[0],
        name_en: 'Emirates Steel Industries',
        name_ar: 'صناعات الإمارات للحديد والصلب',
        customer_type: 'business',
        email: 'procurement@emiratessteel.ae',
        phone: '+971501111111',
        tax_registration_number: '100000000000004',
        address_en: 'Industrial Area, Abu Dhabi',
        address_ar: 'المنطقة الصناعية، أبوظبي',
        city: 'Abu Dhabi',
        country: 'UAE',
      },
      {
        company_id: companyIds[0],
        name_en: 'Dubai Mall Retail',
        name_ar: 'دبي مول للتجزئة',
        customer_type: 'business',
        email: 'orders@dubaimall.ae',
        phone: '+971502222222',
        tax_registration_number: '100000000000005',
        address_en: 'Downtown Dubai, Dubai',
        address_ar: 'وسط مدينة دبي، دبي',
        city: 'Dubai',
        country: 'UAE',
      },
      {
        company_id: companyIds[1],
        name_en: 'Saudi Aramco Services',
        name_ar: 'خدمات أرامكو السعودية',
        customer_type: 'business',
        email: 'procurement@aramco.sa',
        phone: '+966503333333',
        tax_registration_number: '300000000000004',
        address_en: 'Dhahran, Eastern Province',
        address_ar: 'الظهران، المنطقة الشرقية',
        city: 'Dhahran',
        country: 'KSA',
      },
      {
        company_id: companyIds[1],
        name_en: 'Riyadh Construction Co.',
        name_ar: 'شركة الرياض للإنشاءات',
        customer_type: 'business',
        email: 'projects@riyadhconstruction.sa',
        phone: '+966504444444',
        tax_registration_number: '300000000000005',
        address_en: 'King Abdulaziz Road, Riyadh',
        address_ar: 'طريق الملك عبدالعزيز، الرياض',
        city: 'Riyadh',
        country: 'KSA',
      },
    ];

    const customerIds: string[] = [];
    for (const customer of customers) {
      const result = await queryRunner.query(
        `
        INSERT INTO customers (company_id, name_en, name_ar, customer_type, email, phone, tax_registration_number, address_en, address_ar, city, country)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id
      `,
        [
          customer.company_id,
          customer.name_en,
          customer.name_ar,
          customer.customer_type,
          customer.email,
          customer.phone,
          customer.tax_registration_number,
          customer.address_en,
          customer.address_ar,
          customer.city,
          customer.country,
        ],
      );
      customerIds.push(result[0].id);
    }

    // 10. Insert Sample Items
    const items = [
      {
        company_id: companyIds[0],
        sku: 'STEEL-001',
        name_en: 'Steel Rebar 12mm',
        name_ar: 'حديد التسليح 12 مم',
        description_en: 'High quality steel rebar for construction',
        description_ar: 'حديد تسليح عالي الجودة للبناء',
        item_type: 'product',
        unit_price: 25.5,
        cost_price: 20.0,
        tax_rate: 5,
        category: 'Construction Materials',
      },
      {
        company_id: companyIds[0],
        sku: 'CEMENT-001',
        name_en: 'Portland Cement 50kg',
        name_ar: 'أسمنت بورتلاند 50 كيلو',
        description_en: 'Premium Portland cement for construction',
        description_ar: 'أسمنت بورتلاند ممتاز للبناء',
        item_type: 'product',
        unit_price: 18.75,
        cost_price: 15.0,
        tax_rate: 5,
        category: 'Construction Materials',
      },
      {
        company_id: companyIds[1],
        sku: 'OIL-001',
        name_en: 'Motor Oil 5W-30',
        name_ar: 'زيت محرك 5W-30',
        description_en: 'Synthetic motor oil for vehicles',
        description_ar: 'زيت محرك صناعي للمركبات',
        item_type: 'product',
        unit_price: 45.0,
        cost_price: 35.0,
        tax_rate: 15,
        category: 'Automotive',
      },
      {
        company_id: companyIds[1],
        sku: 'FILTER-001',
        name_en: 'Air Filter Premium',
        name_ar: 'فلتر هواء ممتاز',
        description_en: 'High performance air filter',
        description_ar: 'فلتر هواء عالي الأداء',
        item_type: 'product',
        unit_price: 28.5,
        cost_price: 22.0,
        tax_rate: 15,
        category: 'Automotive',
      },
    ];

    const itemIds: string[] = [];
    for (const item of items) {
      const result = await queryRunner.query(
        `
        INSERT INTO items (company_id, sku, name_en, name_ar, description_en, description_ar, item_type, unit_price, cost_price, tax_rate, category)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id
      `,
        [
          item.company_id,
          item.sku,
          item.name_en,
          item.name_ar,
          item.description_en,
          item.description_ar,
          item.item_type,
          item.unit_price,
          item.cost_price,
          item.tax_rate,
          item.category,
        ],
      );
      itemIds.push(result[0].id);
    }

    // 11. Insert Sample Invoices
    const invoices = [
      {
        company_id: companyIds[0],
        customer_name: 'Emirates Steel Industries',
        customer_email: 'procurement@emiratessteel.ae',
        customer_phone: '+971501111111',
        customer_address: 'Industrial Area, Abu Dhabi',
        customer_trn: '100000000000004',
        invoice_number: 'INV-001',
        invoice_date: '2024-01-15',
        due_date: '2024-02-14',
        status: 'Sent',
        subtotal: 1000.0,
        vat_amount: 50.0,
        total_amount: 1050.0,
        vat_rate: 5,
        notes_en: 'Thank you for your business',
        notes_ar: 'شكراً لتعاملكم معنا',
      },
      {
        company_id: companyIds[0],
        customer_name: 'Dubai Mall Retail',
        customer_email: 'orders@dubaimall.ae',
        customer_phone: '+971502222222',
        customer_address: 'Downtown Dubai, Dubai',
        customer_trn: '100000000000005',
        invoice_number: 'INV-002',
        invoice_date: '2024-01-16',
        due_date: '2024-02-15',
        status: 'Draft',
        subtotal: 750.0,
        vat_amount: 37.5,
        total_amount: 787.5,
        vat_rate: 5,
        notes_en: 'Payment terms: 30 days',
        notes_ar: 'شروط الدفع: 30 يوم',
      },
      {
        company_id: companyIds[1],
        customer_name: 'Saudi Aramco Services',
        customer_email: 'procurement@aramco.sa',
        customer_phone: '+966503333333',
        customer_address: 'Dhahran, Eastern Province',
        customer_trn: '300000000000004',
        invoice_number: 'INV-001',
        invoice_date: '2024-01-15',
        due_date: '2024-02-14',
        status: 'Paid',
        subtotal: 2000.0,
        vat_amount: 300.0,
        total_amount: 2300.0,
        vat_rate: 15,
        notes_en: 'Paid in full',
        notes_ar: 'تم الدفع بالكامل',
      },
      {
        company_id: companyIds[1],
        customer_name: 'Riyadh Construction Co.',
        customer_email: 'projects@riyadhconstruction.sa',
        customer_phone: '+966504444444',
        customer_address: 'King Abdulaziz Road, Riyadh',
        customer_trn: '300000000000005',
        invoice_number: 'INV-002',
        invoice_date: '2024-01-16',
        due_date: '2024-02-15',
        status: 'Sent',
        subtotal: 1500.0,
        vat_amount: 225.0,
        total_amount: 1725.0,
        vat_rate: 15,
        notes_en: 'Construction materials supply',
        notes_ar: 'توريد مواد البناء',
      },
    ];

    const invoiceIds: string[] = [];
    for (const invoice of invoices) {
      // Check if invoice already exists
      const existing = await queryRunner.query(
        `
        SELECT id FROM invoices WHERE invoice_number = $1 LIMIT 1
      `,
        [invoice.invoice_number],
      );

      if (existing.length > 0) {
        invoiceIds.push(existing[0].id);
      } else {
        const result = await queryRunner.query(
          `
          INSERT INTO invoices (company_id, customer_name, customer_email, customer_phone, customer_address, customer_trn, invoice_number, invoice_date, due_date, status, subtotal_amount, tax_amount, total_amount, vat_amount, vat_rate, notes_en, notes_ar)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
          RETURNING id
        `,
          [
            invoice.company_id,
            invoice.customer_name,
            invoice.customer_email,
            invoice.customer_phone,
            invoice.customer_address,
            invoice.customer_trn,
            invoice.invoice_number,
            invoice.invoice_date,
            invoice.due_date,
            invoice.status,
            invoice.subtotal,
            invoice.vat_amount,
            invoice.total_amount,
            invoice.vat_amount,
            invoice.vat_rate,
            invoice.notes_en,
            invoice.notes_ar,
          ],
        );
        invoiceIds.push(result[0].id);
      }
    }

    // 12. Insert Sample Invoice Items
    const invoiceItems = [
      {
        invoice_id: invoiceIds[0],
        item_id: itemIds[0],
        description_en: 'Steel Rebar 12mm',
        description_ar: 'حديد التسليح 12 مم',
        quantity: 20,
        unit_price: 25.5,
        tax_rate: 5,
        tax_amount: 25.5,
        line_total: 535.5,
      },
      {
        invoice_id: invoiceIds[0],
        item_id: itemIds[1],
        description_en: 'Portland Cement 50kg',
        description_ar: 'أسمنت بورتلاند 50 كيلو',
        quantity: 25,
        unit_price: 18.75,
        tax_rate: 5,
        tax_amount: 23.44,
        line_total: 492.19,
      },
      {
        invoice_id: invoiceIds[2],
        item_id: itemIds[2],
        description_en: 'Motor Oil 5W-30',
        description_ar: 'زيت محرك 5W-30',
        quantity: 30,
        unit_price: 45.0,
        tax_rate: 15,
        tax_amount: 202.5,
        line_total: 1552.5,
      },
      {
        invoice_id: invoiceIds[2],
        item_id: itemIds[3],
        description_en: 'Air Filter Premium',
        description_ar: 'فلتر هواء ممتاز',
        quantity: 15,
        unit_price: 28.5,
        tax_rate: 15,
        tax_amount: 64.13,
        line_total: 491.63,
      },
    ];

    for (const item of invoiceItems) {
      await queryRunner.query(
        `
        INSERT INTO invoice_items (invoice_id, item_id, description_en, description_ar, quantity, unit_price, tax_rate, tax_amount, line_total)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `,
        [
          item.invoice_id,
          item.item_id,
          item.description_en,
          item.description_ar,
          item.quantity,
          item.unit_price,
          item.tax_rate,
          item.tax_amount,
          item.line_total,
        ],
      );
    }

    // 13. Insert Sample Payments
    const payments = [
      {
        company_id: companyIds[0],
        invoice_id: invoiceIds[0],
        payment_date: '2024-01-20',
        amount: 1050.0,
        payment_method: 'bank',
        reference_number: 'TXN-001-2024',
        notes: 'Bank transfer received',
        created_by: userIds[0],
      },
      {
        company_id: companyIds[1],
        invoice_id: invoiceIds[2],
        payment_date: '2024-01-18',
        amount: 2300.0,
        payment_method: 'bank',
        reference_number: 'TXN-002-2024',
        notes: 'Full payment received via bank transfer',
        created_by: userIds[2],
      },
    ];

    for (const payment of payments) {
      await queryRunner.query(
        `
        INSERT INTO payments (company_id, invoice_id, payment_date, amount, payment_method, reference_number, notes, created_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `,
        [
          payment.company_id,
          payment.invoice_id,
          payment.payment_date,
          payment.amount,
          payment.payment_method,
          payment.reference_number,
          payment.notes,
          payment.created_by,
        ],
      );
    }

    console.log('✅ Seed data inserted successfully');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM payments');
    await queryRunner.query('DELETE FROM invoice_items');
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
