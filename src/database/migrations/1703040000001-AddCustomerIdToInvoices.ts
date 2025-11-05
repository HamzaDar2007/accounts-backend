import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class AddCustomerIdToInvoices1703040000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add customer_id column
    await queryRunner.addColumn('invoices', new TableColumn({
      name: 'customer_id',
      type: 'uuid',
      isNullable: true,
    }));

    // Add foreign key constraint
    await queryRunner.createForeignKey('invoices', new TableForeignKey({
      columnNames: ['customer_id'],
      referencedTableName: 'customers',
      referencedColumnNames: ['id'],
      onDelete: 'SET NULL',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key first
    const table = await queryRunner.getTable('invoices');
    if (table) {
      const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('customer_id') !== -1);
      if (foreignKey) {
        await queryRunner.dropForeignKey('invoices', foreignKey);
      }
    }

    // Drop column
    await queryRunner.dropColumn('invoices', 'customer_id');
  }
}