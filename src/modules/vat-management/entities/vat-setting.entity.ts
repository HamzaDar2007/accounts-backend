import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Company } from '../../companies/entities/company.entity';
import { Country } from '../../../common/enums/country.enum';

@Entity('vat_settings')
export class VatSetting extends BaseEntity {
  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ type: 'enum', enum: Country })
  country: Country;

  @Column({ name: 'vat_rate', type: 'decimal', precision: 5, scale: 2 })
  vatRate: number;

  @Column({ name: 'is_default', default: false })
  isDefault: boolean;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ length: 100, nullable: true })
  description: string;

  @Column({ name: 'description_ar', length: 100, nullable: true })
  descriptionAr: string;
}