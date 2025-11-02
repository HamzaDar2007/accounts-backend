import { Entity, Column, OneToMany, OneToOne, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Country, Currency } from '../../../common/enums/country.enum';
import { User } from '../../users/entities/user.entity';
import { CompanySettings } from './company-settings.entity';

@Entity('companies')
@Index(['taxRegistrationNumber'], { unique: true, where: 'taxRegistrationNumber IS NOT NULL' })
export class Company extends BaseEntity {
  @Column({ length: 255 })
  name: string;

  @Column({ name: 'name_en', length: 255, nullable: true })
  nameEn: string;

  @Column({ name: 'name_ar', length: 255, nullable: true })
  nameAr: string;

  @Column({ name: 'trade_license_number', length: 100, nullable: true })
  tradeLicenseNumber: string;

  @Column({ name: 'tax_registration_number', length: 50, nullable: true })
  taxRegistrationNumber: string;

  @Column({ type: 'enum', enum: Country })
  country: Country;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ name: 'address_en', type: 'text', nullable: true })
  addressEn: string;

  @Column({ name: 'address_ar', type: 'text', nullable: true })
  addressAr: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ name: 'logo_url', nullable: true })
  logoUrl: string;

  @Column({ type: 'enum', enum: Currency })
  currency: Currency;

  @Column({ name: 'vat_rate', type: 'decimal', precision: 5, scale: 2 })
  vatRate: number;

  @Column({ name: 'fiscal_year_start', type: 'date', nullable: true })
  fiscalYearStart: Date;

  @Column({ name: 'is_vat_registered', type: 'boolean', default: true })
  isVatRegistered: boolean;

  @OneToMany(() => User, user => user.company)
  users: User[];

  @OneToOne(() => CompanySettings, settings => settings.company)
  settings: CompanySettings;
}