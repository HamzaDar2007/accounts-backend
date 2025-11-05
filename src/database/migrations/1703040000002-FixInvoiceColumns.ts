import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class FixInvoiceColumns1703040000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check and add columns that don't exist
    const table = await queryRunner.getTable('invoices');
    const existingColumns = table?.columns.map(col => col.name) || [];
    
    const columnsToAdd = [
      { name: 'issue_date', type: 'date' },
      { name: 'invoice_type', type: 'enum', enum: ['full', 'simplified'], default: "'full'" },
      { name: 'subtotal_amount', type: 'decimal', precision: 18, scale: 2 },
      { name: 'tax_amount', type: 'decimal', precision: 18, scale: 2 },
      { name: 'currency', type: 'enum', enum: ['AED', 'SAR', 'EGP', 'USD'], default: "'AED'" },
      { name: 'exchange_rate', type: 'decimal', precision: 10, scale: 4, default: 1 },
      { name: 'total_amount_aed', type: 'decimal', precision: 18, scale: 2 },
      { name: 'notes_en', type: 'text', isNullable: true },
      { name: 'payment_terms', type: 'int', isNullable: true },
      { name: 'qr_code_data', type: 'text', isNullable: true },
      { name: 'pdf_url', type: 'text', isNullable: true },
      { name: 'sent_at', type: 'timestamp', isNullable: true },
      { name: 'paid_at', type: 'timestamp', isNullable: true },
      { name: 'created_by', type: 'uuid' },
    ];

    for (const columnDef of columnsToAdd) {
      if (!existingColumns.includes(columnDef.name)) {
        await queryRunner.addColumn('invoices', new TableColumn(columnDef));
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('invoices', [
      'issue_date', 'supply_date', 'invoice_type', 'subtotal_amount', 
      'tax_amount', 'currency', 'exchange_rate', 'total_amount_aed',
      'notes_en', 'payment_terms', 'qr_code_data', 'pdf_url', 
      'sent_at', 'paid_at', 'created_by'
    ]);
  }
}