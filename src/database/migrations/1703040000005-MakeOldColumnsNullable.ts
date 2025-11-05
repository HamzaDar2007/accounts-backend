import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeOldColumnsNullable1703040000005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "invoices" ALTER COLUMN "vat_amount" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "invoices" ALTER COLUMN "vat_rate" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "invoices" ALTER COLUMN "vat_amount" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "invoices" ALTER COLUMN "vat_rate" SET NOT NULL`);
  }
}