import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateInvoicesTable1703010000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'invoices',
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
          },
          {
            name: 'customer_name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'customer_email',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'customer_phone',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'customer_address',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'customer_trn',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'invoice_number',
            type: 'varchar',
            length: '50',
            isUnique: true,
          },
          {
            name: 'invoice_date',
            type: 'date',
          },
          {
            name: 'due_date',
            type: 'date',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled'],
            default: "'Draft'",
          },
          {
            name: 'subtotal',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'discount_amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: 'vat_amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'total_amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'vat_rate',
            type: 'decimal',
            precision: 5,
            scale: 2,
          },
          {
            name: 'payment_method',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'notes_ar',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'qr_code',
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

    await queryRunner.createForeignKey('invoices',
      new TableForeignKey({
        columnNames: ['company_id'],
        referencedTableName: 'companies',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );



    await queryRunner.createIndex('invoices',
      new TableIndex({
        name: 'IDX_invoices_company_id',
        columnNames: ['company_id'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('invoices');
  }
}