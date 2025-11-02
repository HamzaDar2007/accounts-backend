import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixCompanySettingsTable1703023000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop existing columns that don't match entity
    await queryRunner.query(`ALTER TABLE "company_settings" DROP COLUMN IF EXISTS "invoice_number_start"`);
    await queryRunner.query(`ALTER TABLE "company_settings" DROP COLUMN IF EXISTS "default_payment_terms"`);
    await queryRunner.query(`ALTER TABLE "company_settings" DROP COLUMN IF EXISTS "auto_send_invoices"`);
    await queryRunner.query(`ALTER TABLE "company_settings" DROP COLUMN IF EXISTS "email_template"`);

    // Add missing columns from entity
    await queryRunner.query(`ALTER TABLE "company_settings" ADD COLUMN "next_invoice_number" bigint DEFAULT 1`);
    await queryRunner.query(`ALTER TABLE "company_settings" ADD COLUMN "numbering_reset" varchar DEFAULT 'none'`);
    await queryRunner.query(`ALTER TABLE "company_settings" ADD COLUMN "language_default" varchar DEFAULT 'en'`);
    await queryRunner.query(`ALTER TABLE "company_settings" ADD COLUMN "pdf_template" varchar(50) DEFAULT 'default'`);
    await queryRunner.query(`ALTER TABLE "company_settings" ADD COLUMN "allow_country_override" boolean DEFAULT false`);

    // Update invoice_prefix length to match entity
    await queryRunner.query(`ALTER TABLE "company_settings" ALTER COLUMN "invoice_prefix" TYPE varchar(20)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert changes
    await queryRunner.query(`ALTER TABLE "company_settings" DROP COLUMN IF EXISTS "next_invoice_number"`);
    await queryRunner.query(`ALTER TABLE "company_settings" DROP COLUMN IF EXISTS "numbering_reset"`);
    await queryRunner.query(`ALTER TABLE "company_settings" DROP COLUMN IF EXISTS "language_default"`);
    await queryRunner.query(`ALTER TABLE "company_settings" DROP COLUMN IF EXISTS "pdf_template"`);
    await queryRunner.query(`ALTER TABLE "company_settings" DROP COLUMN IF EXISTS "allow_country_override"`);

    await queryRunner.query(`ALTER TABLE "company_settings" ADD COLUMN "invoice_number_start" integer DEFAULT 1`);
    await queryRunner.query(`ALTER TABLE "company_settings" ADD COLUMN "default_payment_terms" integer DEFAULT 30`);
    await queryRunner.query(`ALTER TABLE "company_settings" ADD COLUMN "auto_send_invoices" boolean DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "company_settings" ADD COLUMN "email_template" text`);

    await queryRunner.query(`ALTER TABLE "company_settings" ALTER COLUMN "invoice_prefix" TYPE varchar(10)`);
  }
}