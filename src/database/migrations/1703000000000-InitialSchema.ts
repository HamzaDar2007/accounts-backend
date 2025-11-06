import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class InitialSchema1703000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create companies table
    await queryRunner.createTable(
      new Table({
        name: 'companies',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'legal_name',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'country',
            type: 'enum',
            enum: ['UAE', 'KSA', 'Egypt'],
          },
          {
            name: 'currency',
            type: 'enum',
            enum: ['AED', 'SAR', 'EGP'],
          },
          {
            name: 'trn',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'address_json',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'logo_url',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'vat_enabled',
            type: 'boolean',
            default: true,
          },
          {
            name: 'default_vat_rate',
            type: 'decimal',
            precision: 5,
            scale: 2,
          },
          {
            name: 'owner_user_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'is_sandbox',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createIndex('companies', 
      new TableIndex({
        name: 'IDX_companies_trn',
        columnNames: ['trn'],
        isUnique: true,
        where: 'trn IS NOT NULL',
      })
    );

    // Create users table
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'company_id',
            type: 'uuid',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'password_hash',
            type: 'varchar',
          },
          {
            name: 'role',
            type: 'enum',
            enum: ['Owner', 'Staff', 'Accountant'],
          },
          {
            name: 'first_name',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'last_name',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'language',
            type: 'enum',
            enum: ['en', 'ar'],
            default: "'en'",
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'last_login_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createIndex('users', 
      new TableIndex({
        name: 'IDX_users_company_email',
        columnNames: ['company_id', 'email'],
        isUnique: true,
      })
    );

    await queryRunner.createForeignKey('users', 
      new TableForeignKey({
        columnNames: ['company_id'],
        referencedTableName: 'companies',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );

    // Create user_profiles table
    await queryRunner.createTable(
      new Table({
        name: 'user_profiles',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'user_id',
            type: 'uuid',
            isUnique: true,
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'avatar_url',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'timezone',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'date_format',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey('user_profiles', 
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );

    // Create company_settings table
    await queryRunner.createTable(
      new Table({
        name: 'company_settings',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'company_id',
            type: 'uuid',
            isUnique: true,
          },
          {
            name: 'invoice_prefix',
            type: 'varchar',
            length: '20',
            default: "'INV'",
          },
          {
            name: 'next_invoice_number',
            type: 'bigint',
            default: 1,
          },
          {
            name: 'numbering_reset',
            type: 'enum',
            enum: ['none', 'yearly', 'monthly'],
            default: "'none'",
          },
          {
            name: 'language_default',
            type: 'enum',
            enum: ['en', 'ar'],
            default: "'en'",
          },
          {
            name: 'pdf_template',
            type: 'varchar',
            length: '50',
            default: "'default'",
          },
          {
            name: 'allow_country_override',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey('company_settings', 
      new TableForeignKey({
        columnNames: ['company_id'],
        referencedTableName: 'companies',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );

    // Create roles table
    await queryRunner.createTable(
      new Table({
        name: 'roles',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '50',
            isUnique: true,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'is_system_role',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    // Create permissions table
    await queryRunner.createTable(
      new Table({
        name: 'permissions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
            isUnique: true,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'resource',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'action',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    // Create role_permissions table
    await queryRunner.createTable(
      new Table({
        name: 'role_permissions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'role_id',
            type: 'uuid',
          },
          {
            name: 'permission_id',
            type: 'uuid',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createIndex('role_permissions', 
      new TableIndex({
        name: 'IDX_role_permissions_unique',
        columnNames: ['role_id', 'permission_id'],
        isUnique: true,
      })
    );

    await queryRunner.createForeignKey('role_permissions', 
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedTableName: 'roles',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey('role_permissions', 
      new TableForeignKey({
        columnNames: ['permission_id'],
        referencedTableName: 'permissions',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );

    // Create customers table
    await queryRunner.createTable(
      new Table({
        name: 'customers',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'company_id',
            type: 'uuid',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'contact_name',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'billing_address_json',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'trn',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_by',
            type: 'uuid',
          },
          {
            name: 'updated_by',
            type: 'uuid',
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey('customers',
      new TableForeignKey({
        columnNames: ['company_id'],
        referencedTableName: 'companies',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createIndex('customers',
      new TableIndex({
        name: 'IDX_customers_company_id',
        columnNames: ['company_id'],
      })
    );

    // Create items table
    await queryRunner.createTable(
      new Table({
        name: 'items',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'company_id',
            type: 'uuid',
          },
          {
            name: 'sku',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'name_ar',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'description_ar',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'unit_price',
            type: 'decimal',
            precision: 18,
            scale: 2,
          },
          {
            name: 'unit_cost',
            type: 'decimal',
            precision: 18,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'tax_rate_override',
            type: 'decimal',
            precision: 5,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_by',
            type: 'uuid',
          },
          {
            name: 'updated_by',
            type: 'uuid',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey('items',
      new TableForeignKey({
        columnNames: ['company_id'],
        referencedTableName: 'companies',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createIndex('items',
      new TableIndex({
        name: 'IDX_items_company_id',
        columnNames: ['company_id'],
      })
    );

    // Create invoices table
    await queryRunner.createTable(
      new Table({
        name: 'invoices',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'company_id',
            type: 'uuid',
          },
          {
            name: 'customer_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'number',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled'],
            default: "'Draft'",
          },
          {
            name: 'issue_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'due_date',
            type: 'date',
          },
          {
            name: 'seller_trn_snapshot',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'buyer_trn_snapshot',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'currency',
            type: 'enum',
            enum: ['AED', 'SAR', 'EGP'],
          },
          {
            name: 'exchange_rate',
            type: 'decimal',
            precision: 10,
            scale: 4,
            default: 1,
          },
          {
            name: 'discount_total',
            type: 'decimal',
            precision: 18,
            scale: 2,
            default: 0,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'payment_method_note',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'subtotal',
            type: 'decimal',
            precision: 18,
            scale: 2,
          },
          {
            name: 'tax_total',
            type: 'decimal',
            precision: 18,
            scale: 2,
          },
          {
            name: 'total',
            type: 'decimal',
            precision: 18,
            scale: 2,
          },
          {
            name: 'total_paid',
            type: 'decimal',
            precision: 18,
            scale: 2,
          },
          {
            name: 'balance_due',
            type: 'decimal',
            precision: 18,
            scale: 2,
          },
          {
            name: 'pdf_url',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'qr_payload',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'meta',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'created_by',
            type: 'uuid',
          },
          {
            name: 'updated_by',
            type: 'uuid',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey('invoices',
      new TableForeignKey({
        columnNames: ['company_id'],
        referencedTableName: 'companies',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey('invoices',
      new TableForeignKey({
        columnNames: ['customer_id'],
        referencedTableName: 'customers',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      })
    );

    await queryRunner.createIndex('invoices',
      new TableIndex({
        name: 'IDX_invoices_company_id',
        columnNames: ['company_id'],
      })
    );

    await queryRunner.createIndex('invoices',
      new TableIndex({
        name: 'IDX_invoices_number',
        columnNames: ['number'],
        isUnique: true,
      })
    );

    // Create invoice_lines table
    await queryRunner.createTable(
      new Table({
        name: 'invoice_lines',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'invoice_id',
            type: 'uuid',
          },
          {
            name: 'item_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'text',
          },
          {
            name: 'description_ar',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'quantity',
            type: 'decimal',
            precision: 18,
            scale: 3,
          },
          {
            name: 'unit_price',
            type: 'decimal',
            precision: 18,
            scale: 2,
          },
          {
            name: 'discount_amount',
            type: 'decimal',
            precision: 18,
            scale: 2,
            default: 0,
          },
          {
            name: 'tax_rate_percent',
            type: 'decimal',
            precision: 5,
            scale: 2,
          },
          {
            name: 'line_subtotal',
            type: 'decimal',
            precision: 18,
            scale: 2,
          },
          {
            name: 'tax_amount',
            type: 'decimal',
            precision: 18,
            scale: 2,
          },
          {
            name: 'line_total',
            type: 'decimal',
            precision: 18,
            scale: 2,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey('invoice_lines',
      new TableForeignKey({
        columnNames: ['invoice_id'],
        referencedTableName: 'invoices',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey('invoice_lines',
      new TableForeignKey({
        columnNames: ['item_id'],
        referencedTableName: 'items',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      })
    );

    await queryRunner.createIndex('invoice_lines',
      new TableIndex({
        name: 'IDX_invoice_lines_invoice_id',
        columnNames: ['invoice_id'],
      })
    );

    // Create payments table
    await queryRunner.createTable(
      new Table({
        name: 'payments',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'company_id',
            type: 'uuid',
          },
          {
            name: 'invoice_id',
            type: 'uuid',
          },
          {
            name: 'received_on',
            type: 'date',
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 18,
            scale: 2,
          },
          {
            name: 'method',
            type: 'enum',
            enum: ['cash', 'bank', 'card', 'other'],
          },
          {
            name: 'reference',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'attachment_url',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_by',
            type: 'uuid',
          },
          {
            name: 'updated_by',
            type: 'uuid',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey('payments',
      new TableForeignKey({
        columnNames: ['company_id'],
        referencedTableName: 'companies',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey('payments',
      new TableForeignKey({
        columnNames: ['invoice_id'],
        referencedTableName: 'invoices',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createIndex('payments',
      new TableIndex({
        name: 'IDX_payments_company_id',
        columnNames: ['company_id'],
      })
    );

    await queryRunner.createIndex('payments',
      new TableIndex({
        name: 'IDX_payments_invoice_id',
        columnNames: ['invoice_id'],
      })
    );

    // Create vat_settings table
    await queryRunner.createTable(
      new Table({
        name: 'vat_settings',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'company_id',
            type: 'uuid',
          },
          {
            name: 'country',
            type: 'enum',
            enum: ['UAE', 'KSA', 'Egypt'],
          },
          {
            name: 'vat_rate',
            type: 'decimal',
            precision: 5,
            scale: 2,
          },
          {
            name: 'is_default',
            type: 'boolean',
            default: false,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'description',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'description_ar',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey('vat_settings',
      new TableForeignKey({
        columnNames: ['company_id'],
        referencedTableName: 'companies',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createIndex('vat_settings',
      new TableIndex({
        name: 'IDX_vat_settings_company_country',
        columnNames: ['company_id', 'country'],
        isUnique: true,
      })
    );

    // Create invoice_templates table
    await queryRunner.createTable(
      new Table({
        name: 'invoice_templates',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'company_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'name_ar',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['standard', 'fta_compliant', 'zatca_compliant', 'custom'],
          },
          {
            name: 'language',
            type: 'enum',
            enum: ['en', 'ar'],
          },
          {
            name: 'country',
            type: 'enum',
            enum: ['UAE', 'KSA', 'Egypt'],
            isNullable: true,
          },
          {
            name: 'is_default',
            type: 'boolean',
            default: false,
          },
          {
            name: 'is_system_template',
            type: 'boolean',
            default: false,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'layout',
            type: 'jsonb',
          },
          {
            name: 'styles',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'description_ar',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey('invoice_templates',
      new TableForeignKey({
        columnNames: ['company_id'],
        referencedTableName: 'companies',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createIndex('invoice_templates',
      new TableIndex({
        name: 'IDX_templates_company_type_language',
        columnNames: ['company_id', 'type', 'language'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('invoice_templates');
    await queryRunner.dropTable('vat_settings');
    await queryRunner.dropTable('payments');
    await queryRunner.dropTable('invoice_lines');
    await queryRunner.dropTable('invoices');
    await queryRunner.dropTable('items');
    await queryRunner.dropTable('customers');
    await queryRunner.dropTable('role_permissions');
    await queryRunner.dropTable('permissions');
    await queryRunner.dropTable('roles');
    await queryRunner.dropTable('company_settings');
    await queryRunner.dropTable('user_profiles');
    await queryRunner.dropTable('users');
    await queryRunner.dropTable('companies');
  }
}