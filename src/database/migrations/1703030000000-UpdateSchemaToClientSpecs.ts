import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSchemaToClientSpecs1703030000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Update users table
    await queryRunner.query(`
      ALTER TABLE users 
      DROP CONSTRAINT IF EXISTS "IDX_users_company_email",
      ADD CONSTRAINT "UQ_users_email" UNIQUE (email),
      ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
      ALTER COLUMN role TYPE VARCHAR(20),
      ADD COLUMN IF NOT EXISTS preferred_language VARCHAR(10) DEFAULT 'en',
      ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP,
      DROP COLUMN IF EXISTS last_login_at
    `);

    // Update companies table
    await queryRunner.query(`
      ALTER TABLE companies 
      ADD COLUMN IF NOT EXISTS name_en VARCHAR(255),
      ADD COLUMN IF NOT EXISTS name_ar VARCHAR(255),
      ADD COLUMN IF NOT EXISTS trade_license_number VARCHAR(100),
      ADD COLUMN IF NOT EXISTS tax_registration_number VARCHAR(50),
      ADD COLUMN IF NOT EXISTS city VARCHAR(100),
      ADD COLUMN IF NOT EXISTS address_en TEXT,
      ADD COLUMN IF NOT EXISTS address_ar TEXT,
      ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
      ADD COLUMN IF NOT EXISTS email VARCHAR(255),
      ADD COLUMN IF NOT EXISTS vat_rate DECIMAL(5,2),
      ADD COLUMN IF NOT EXISTS fiscal_year_start DATE,
      ADD COLUMN IF NOT EXISTS is_vat_registered BOOLEAN DEFAULT true,
      DROP COLUMN IF EXISTS legal_name,
      DROP COLUMN IF EXISTS trn,
      DROP COLUMN IF EXISTS address_json,
      DROP COLUMN IF EXISTS vat_enabled,
      DROP COLUMN IF EXISTS default_vat_rate,
      DROP COLUMN IF EXISTS owner_user_id,
      DROP COLUMN IF EXISTS is_sandbox
    `);

    // Update company_settings table
    await queryRunner.query(`
      ALTER TABLE company_settings
      ADD COLUMN IF NOT EXISTS default_payment_terms INTEGER DEFAULT 30,
      ADD COLUMN IF NOT EXISTS enable_whatsapp_invoicing BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS enable_payroll_module BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS enable_corporate_tax BOOLEAN DEFAULT false,
      DROP COLUMN IF EXISTS numbering_reset,
      DROP COLUMN IF EXISTS language_default,
      DROP COLUMN IF EXISTS pdf_template,
      DROP COLUMN IF EXISTS allow_country_override
    `);

    // Update customers table
    await queryRunner.query(`
      ALTER TABLE customers
      ADD COLUMN IF NOT EXISTS name_en VARCHAR(255),
      ADD COLUMN IF NOT EXISTS name_ar VARCHAR(255),
      ADD COLUMN IF NOT EXISTS customer_type VARCHAR(20),
      ADD COLUMN IF NOT EXISTS tax_registration_number VARCHAR(50),
      ADD COLUMN IF NOT EXISTS address_en TEXT,
      ADD COLUMN IF NOT EXISTS address_ar TEXT,
      ADD COLUMN IF NOT EXISTS city VARCHAR(100),
      ADD COLUMN IF NOT EXISTS country VARCHAR(20),
      ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
      ALTER COLUMN phone TYPE VARCHAR(20),
      DROP COLUMN IF EXISTS name,
      DROP COLUMN IF EXISTS contact_name,
      DROP COLUMN IF EXISTS billing_address_json,
      DROP COLUMN IF EXISTS trn,
      DROP COLUMN IF EXISTS notes,
      DROP COLUMN IF EXISTS created_by,
      DROP COLUMN IF EXISTS updated_by
    `);

    // Create items table if it doesn't exist
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        company_id UUID NOT NULL,
        sku VARCHAR(100),
        name_en VARCHAR(255) NOT NULL,
        name_ar VARCHAR(255),
        description_en TEXT,
        description_ar TEXT,
        item_type VARCHAR(20) DEFAULT 'product',
        unit_price DECIMAL(18,2) NOT NULL,
        cost_price DECIMAL(18,2),
        tax_rate DECIMAL(5,2),
        is_taxable BOOLEAN DEFAULT true,
        category VARCHAR(100),
        current_stock DECIMAL(18,3) DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
      )
    `);

    // Drop existing invoice_items table if exists and recreate
    await queryRunner.query(`DROP TABLE IF EXISTS invoice_items CASCADE`);
    await queryRunner.query(`
      CREATE TABLE invoice_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        invoice_id UUID NOT NULL,
        item_id UUID,
        description_en TEXT NOT NULL,
        description_ar TEXT,
        quantity DECIMAL(18,3) NOT NULL,
        unit_price DECIMAL(18,2) NOT NULL,
        tax_rate DECIMAL(5,2) NOT NULL,
        tax_amount DECIMAL(18,2) NOT NULL,
        discount_amount DECIMAL(18,2) DEFAULT 0,
        line_total DECIMAL(18,2) NOT NULL,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
        FOREIGN KEY (item_id) REFERENCES items(id)
      )
    `);

    // Update invoices table
    await queryRunner.query(`
      ALTER TABLE invoices
      ADD COLUMN IF NOT EXISTS invoice_number VARCHAR(50),
      ADD COLUMN IF NOT EXISTS invoice_type VARCHAR(20),
      ADD COLUMN IF NOT EXISTS supply_date DATE,
      ADD COLUMN IF NOT EXISTS subtotal_amount DECIMAL(18,2),
      ADD COLUMN IF NOT EXISTS tax_amount DECIMAL(18,2),
      ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(18,2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS total_amount DECIMAL(18,2),
      ADD COLUMN IF NOT EXISTS total_amount_aed DECIMAL(18,2),
      ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50),
      ADD COLUMN IF NOT EXISTS notes_en TEXT,
      ADD COLUMN IF NOT EXISTS notes_ar TEXT,
      ADD COLUMN IF NOT EXISTS payment_terms INTEGER,
      ADD COLUMN IF NOT EXISTS qr_code_data TEXT,
      ADD COLUMN IF NOT EXISTS sent_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP,
      DROP COLUMN IF EXISTS number,
      DROP COLUMN IF EXISTS seller_trn_snapshot,
      DROP COLUMN IF EXISTS buyer_trn_snapshot,
      DROP COLUMN IF EXISTS discount_total,
      DROP COLUMN IF EXISTS notes,
      DROP COLUMN IF EXISTS payment_method_note,
      DROP COLUMN IF EXISTS subtotal,
      DROP COLUMN IF EXISTS tax_total,
      DROP COLUMN IF EXISTS total,
      DROP COLUMN IF EXISTS total_paid,
      DROP COLUMN IF EXISTS balance_due,
      DROP COLUMN IF EXISTS qr_payload,
      DROP COLUMN IF EXISTS meta,
      DROP COLUMN IF EXISTS updated_by
    `);

    // Create payments table if it doesn't exist
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        company_id UUID NOT NULL,
        invoice_id UUID NOT NULL,
        payment_date DATE NOT NULL,
        amount DECIMAL(18,2) NOT NULL,
        payment_method VARCHAR(20) NOT NULL,
        reference_number VARCHAR(255),
        notes TEXT,
        created_by UUID NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
        FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
      )
    `);

    // Create new tables
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS accounts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        company_id UUID NOT NULL,
        account_code VARCHAR(20) NOT NULL,
        account_name_en VARCHAR(255) NOT NULL,
        account_name_ar VARCHAR(255),
        account_type VARCHAR(20) NOT NULL,
        account_subtype VARCHAR(100),
        parent_account_id UUID,
        is_system_account BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
        FOREIGN KEY (parent_account_id) REFERENCES accounts(id)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS journal_entries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        company_id UUID NOT NULL,
        entry_number VARCHAR(50) NOT NULL,
        entry_date DATE NOT NULL,
        entry_type VARCHAR(20) NOT NULL,
        source_type VARCHAR(20),
        source_id UUID,
        description_en TEXT NOT NULL,
        description_ar TEXT,
        total_debit DECIMAL(18,2) NOT NULL,
        total_credit DECIMAL(18,2) NOT NULL,
        created_by UUID NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS journal_entry_lines (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        journal_entry_id UUID NOT NULL,
        account_id UUID NOT NULL,
        debit_amount DECIMAL(18,2) DEFAULT 0,
        credit_amount DECIMAL(18,2) DEFAULT 0,
        description_en TEXT,
        description_ar TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (journal_entry_id) REFERENCES journal_entries(id) ON DELETE CASCADE,
        FOREIGN KEY (account_id) REFERENCES accounts(id)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS tax_reports (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        company_id UUID NOT NULL,
        report_type VARCHAR(20) NOT NULL,
        period_start DATE NOT NULL,
        period_end DATE NOT NULL,
        total_sales DECIMAL(18,2) NOT NULL,
        total_purchases DECIMAL(18,2) NOT NULL,
        output_vat DECIMAL(18,2) NOT NULL,
        input_vat DECIMAL(18,2) NOT NULL,
        net_vat_payable DECIMAL(18,2) NOT NULL,
        status VARCHAR(20) DEFAULT 'draft',
        submitted_at TIMESTAMP,
        report_data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS backup_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        company_id UUID NOT NULL,
        backup_type VARCHAR(20) NOT NULL,
        backup_location TEXT NOT NULL,
        backup_size BIGINT,
        status VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        company_id UUID NOT NULL,
        user_id UUID NOT NULL,
        action VARCHAR(20) NOT NULL,
        entity_type VARCHAR(100) NOT NULL,
        entity_id UUID NOT NULL,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS faq_categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title_en VARCHAR(255) NOT NULL,
        title_ar VARCHAR(255),
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS faqs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        category_id UUID NOT NULL,
        question_en TEXT NOT NULL,
        question_ar TEXT,
        answer_en TEXT NOT NULL,
        answer_ar TEXT,
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES faq_categories(id)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS onboarding_steps (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        company_id UUID NOT NULL,
        step_name VARCHAR(50) NOT NULL,
        is_completed BOOLEAN DEFAULT false,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
      )
    `);

    // Drop user_profiles table as it's no longer needed
    await queryRunner.query(`DROP TABLE IF EXISTS user_profiles CASCADE`);
    
    // Drop old tables
    await queryRunner.query(`DROP TABLE IF EXISTS invoice_lines CASCADE`);
    
    // Create indexes for better performance
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS IDX_items_company_id ON items(company_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS IDX_payments_company_id ON payments(company_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS IDX_payments_invoice_id ON payments(invoice_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS IDX_invoice_items_invoice_id ON invoice_items(invoice_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS IDX_invoice_items_item_id ON invoice_items(item_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS IDX_accounts_company_id ON accounts(company_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS IDX_journal_entries_company_id ON journal_entries(company_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS IDX_activity_logs_company_id ON activity_logs(company_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS IDX_onboarding_steps_company_id ON onboarding_steps(company_id)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS onboarding_steps CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS faqs CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS faq_categories CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS activity_logs CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS backup_logs CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS tax_reports CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS journal_entry_lines CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS journal_entries CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS accounts CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS payments CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS items CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS invoice_items CASCADE`);
  }
}