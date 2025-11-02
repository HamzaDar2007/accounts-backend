import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Company } from './company.entity';

@Entity('company_settings')
export class CompanySettings extends BaseEntity {
  @Column({ name: 'company_id', type: 'uuid', unique: true })
  companyId: string;

  @OneToOne(() => Company, company => company.settings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'invoice_prefix', length: 20, default: 'INV' })
  invoicePrefix: string;

  @Column({ name: 'next_invoice_number', type: 'bigint', default: 1 })
  nextInvoiceNumber: number;

  @Column({ name: 'default_payment_terms', type: 'int', default: 30 })
  defaultPaymentTerms: number;

  @Column({ name: 'enable_whatsapp_invoicing', type: 'boolean', default: false })
  enableWhatsappInvoicing: boolean;

  @Column({ name: 'enable_payroll_module', type: 'boolean', default: false })
  enablePayrollModule: boolean;

  @Column({ name: 'enable_corporate_tax', type: 'boolean', default: false })
  enableCorporateTax: boolean;
}