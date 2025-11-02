import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Company } from '../../companies/entities/company.entity';

export enum ReportType {
  VAT_RETURN = 'vat_return',
  CORPORATE_TAX = 'corporate_tax'
}

export enum ReportStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted'
}

@Entity('tax_reports')
export class TaxReport extends BaseEntity {
  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'report_type', type: 'enum', enum: ReportType })
  reportType: ReportType;

  @Column({ name: 'period_start', type: 'date' })
  periodStart: Date;

  @Column({ name: 'period_end', type: 'date' })
  periodEnd: Date;

  @Column({ name: 'total_sales', type: 'decimal', precision: 18, scale: 2 })
  totalSales: number;

  @Column({ name: 'total_purchases', type: 'decimal', precision: 18, scale: 2 })
  totalPurchases: number;

  @Column({ name: 'output_vat', type: 'decimal', precision: 18, scale: 2 })
  outputVat: number;

  @Column({ name: 'input_vat', type: 'decimal', precision: 18, scale: 2 })
  inputVat: number;

  @Column({ name: 'net_vat_payable', type: 'decimal', precision: 18, scale: 2 })
  netVatPayable: number;

  @Column({ type: 'enum', enum: ReportStatus, default: ReportStatus.DRAFT })
  status: ReportStatus;

  @Column({ name: 'submitted_at', type: 'timestamp', nullable: true })
  submittedAt: Date;

  @Column({ name: 'report_data', type: 'jsonb', nullable: true })
  reportData: object;
}