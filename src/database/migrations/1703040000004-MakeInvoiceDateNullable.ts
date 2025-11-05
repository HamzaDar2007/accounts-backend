import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeInvoiceDateNullable1703040000004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "invoices" ALTER COLUMN "invoice_date" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "invoices" ALTER COLUMN "invoice_date" SET NOT NULL`);
  }
}