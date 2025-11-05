import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeCustomerFieldsNullable1703040000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "invoices" ALTER COLUMN "customer_name" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "invoices" ALTER COLUMN "customer_name" SET NOT NULL`);
  }
}