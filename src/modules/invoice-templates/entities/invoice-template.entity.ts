import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Company } from '../../companies/entities/company.entity';
import { Language, Country } from '../../../common/enums/country.enum';

export enum TemplateType {
  STANDARD = 'standard',
  FTA_COMPLIANT = 'fta_compliant',
  ZATCA_COMPLIANT = 'zatca_compliant',
  CUSTOM = 'custom'
}

@Entity('invoice_templates')
export class InvoiceTemplate extends BaseEntity {
  @Column({ name: 'company_id', type: 'uuid', nullable: true })
  companyId: string;

  @ManyToOne(() => Company, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ length: 100 })
  name: string;

  @Column({ name: 'name_ar', length: 100, nullable: true })
  nameAr: string;

  @Column({ type: 'enum', enum: TemplateType })
  type: TemplateType;

  @Column({ type: 'enum', enum: Language })
  language: Language;

  @Column({ type: 'enum', enum: Country, nullable: true })
  country: Country;

  @Column({ name: 'is_default', default: false })
  isDefault: boolean;

  @Column({ name: 'is_system_template', default: false })
  isSystemTemplate: boolean;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'jsonb' })
  layout: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  styles: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'description_ar', type: 'text', nullable: true })
  descriptionAr: string;
}