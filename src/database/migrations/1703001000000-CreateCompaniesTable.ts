import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateCompaniesTable1703001000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
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
            name: 'vat_rate',
            type: 'decimal',
            precision: 5,
            scale: 2,
          },
          {
            name: 'trn',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'logo_url',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'address',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'website',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'subscription_tier',
            type: 'varchar',
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

    await queryRunner.createIndex('companies', 
      new TableIndex({
        name: 'IDX_companies_trn',
        columnNames: ['trn'],
        isUnique: true,
        where: 'trn IS NOT NULL',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('companies');
  }
}