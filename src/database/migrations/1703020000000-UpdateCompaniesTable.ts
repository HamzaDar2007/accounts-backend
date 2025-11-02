import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateCompaniesTable1703020000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add new columns
    await queryRunner.addColumns('companies', [
      new TableColumn({
        name: 'legal_name',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
      new TableColumn({
        name: 'address_json',
        type: 'jsonb',
        isNullable: true,
      }),
      new TableColumn({
        name: 'vat_enabled',
        type: 'boolean',
        default: true,
      }),
      new TableColumn({
        name: 'default_vat_rate',
        type: 'decimal',
        precision: 5,
        scale: 2,
        default: 0,
      }),
      new TableColumn({
        name: 'owner_user_id',
        type: 'uuid',
        isNullable: true,
      }),
      new TableColumn({
        name: 'is_sandbox',
        type: 'boolean',
        default: false,
      }),
    ]);

    // Remove old columns
    await queryRunner.dropColumns('companies', [
      'vat_rate',
      'address',
      'phone',
      'email',
      'website',
      'is_active',
      'subscription_tier'
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverse the changes
    await queryRunner.dropColumns('companies', [
      'legal_name',
      'address_json',
      'vat_enabled',
      'default_vat_rate',
      'owner_user_id',
      'is_sandbox'
    ]);
  }
}