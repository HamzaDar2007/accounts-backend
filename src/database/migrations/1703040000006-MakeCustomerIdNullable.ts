import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeCustomerIdNullable1703040000006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "invoices" ALTER COLUMN "customer_id" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "invoices" ALTER COLUMN "customer_id" SET NOT NULL`);
  }
}