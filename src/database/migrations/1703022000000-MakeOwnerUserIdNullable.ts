import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeOwnerUserIdNullable1703022000000 implements MigrationInterface {
    name = 'MakeOwnerUserIdNullable1703022000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "companies" ALTER COLUMN "owner_user_id" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "companies" ALTER COLUMN "owner_user_id" SET NOT NULL`);
    }
}