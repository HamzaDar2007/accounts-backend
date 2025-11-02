import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateInvoiceItemsTable1703011000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'invoice_items',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'invoice_id',
            type: 'uuid',
          },

          {
            name: 'description',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'description_ar',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'quantity',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'unit_price',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'line_total',
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
            name: 'vat_amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
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

    await queryRunner.createForeignKey('invoice_items',
      new TableForeignKey({
        columnNames: ['invoice_id'],
        referencedTableName: 'invoices',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );



    await queryRunner.createIndex('invoice_items',
      new TableIndex({
        name: 'IDX_invoice_items_invoice_id',
        columnNames: ['invoice_id'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('invoice_items');
  }
}