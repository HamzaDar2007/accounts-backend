import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Company } from '../../companies/entities/company.entity';
import { Customer } from '../../customers/entities/customer.entity';
import { InvoiceStatus, Currency } from '../../../common/enums/country.enum';
import { InvoiceItem } from './invoice-item.entity';

export enum InvoiceType {
  FULL = 'full',
  SIMPLIFIED = 'simplified'
}

@Entity('invoices')
export class Invoice extends BaseEntity {
  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'customer_id', type: 'uuid' })
  customerId: string;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ name: 'invoice_number', length: 50 })
  invoiceNumber: string;

  @Column({ name: 'invoice_type', type: 'enum', enum: InvoiceType })
  invoiceType: InvoiceType;

  @Column({ type: 'enum', enum: InvoiceStatus, default: InvoiceStatus.DRAFT })
  status: InvoiceStatus;

  @Column({ name: 'issue_date', type: 'date' })
  issueDate: Date;

  @Column({ name: 'due_date', type: 'date' })
  dueDate: Date;

  @Column({ name: 'supply_date', type: 'date' })
  supplyDate: Date;

  @Column({ name: 'subtotal_amount', type: 'decimal', precision: 18, scale: 2 })
  subtotalAmount: number;

  @Column({ name: 'tax_amount', type: 'decimal', precision: 18, scale: 2 })
  taxAmount: number;

  @Column({ name: 'discount_amount', type: 'decimal', precision: 18, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ name: 'total_amount', type: 'decimal', precision: 18, scale: 2 })
  totalAmount: number;

  @Column({ type: 'enum', enum: Currency })
  currency: Currency;

  @Column({ name: 'exchange_rate', type: 'decimal', precision: 10, scale: 4, default: 1 })
  exchangeRate: number;

  @Column({ name: 'total_amount_aed', type: 'decimal', precision: 18, scale: 2 })
  totalAmountAed: number;

  @Column({ name: 'payment_method', length: 50, nullable: true })
  paymentMethod: string;

  @Column({ name: 'notes_en', type: 'text', nullable: true })
  notesEn: string;

  @Column({ name: 'notes_ar', type: 'text', nullable: true })
  notesAr: string;

  @Column({ name: 'payment_terms', type: 'int', nullable: true })
  paymentTerms: number;

  @Column({ name: 'qr_code_data', type: 'text', nullable: true })
  qrCodeData: string;

  @Column({ name: 'pdf_url', type: 'text', nullable: true })
  pdfUrl: string;

  @Column({ name: 'sent_at', type: 'timestamp', nullable: true })
  sentAt: Date;

  @Column({ name: 'paid_at', type: 'timestamp', nullable: true })
  paidAt: Date;

  @Column({ name: 'created_by', type: 'uuid' })
  createdBy: string;

  @OneToMany(() => InvoiceItem, item => item.invoice, { cascade: true })
  items: InvoiceItem[];
}