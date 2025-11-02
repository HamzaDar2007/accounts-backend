import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateCompanySettingsTable1703004000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
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
            length: '10',
            default: "'INV'",
          },
          {
            name: 'invoice_number_start',
            type: 'integer',
            default: 1,
          },
          {
            name: 'default_payment_terms',
            type: 'integer',
            default: 30,
          },
          {
            name: 'auto_send_invoices',
            type: 'boolean',
            default: false,
          },
          {
            name: 'email_template',
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

    await queryRunner.createForeignKey('company_settings', 
      new TableForeignKey({
        columnNames: ['company_id'],
        referencedTableName: 'companies',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('company_settings');
  }
}