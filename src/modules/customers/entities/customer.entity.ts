import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Company } from '../../companies/entities/company.entity';
import { Country } from '../../../common/enums/country.enum';

export enum CustomerType {
  INDIVIDUAL = 'individual',
  BUSINESS = 'business'
}

@Entity('customers')
export class Customer extends BaseEntity {
  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'name_en', length: 255 })
  nameEn: string;

  @Column({ name: 'name_ar', length: 255, nullable: true })
  nameAr: string;

  @Column({ name: 'customer_type', type: 'enum', enum: CustomerType })
  customerType: CustomerType;

  @Column({ name: 'tax_registration_number', length: 50, nullable: true })
  taxRegistrationNumber: string;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ name: 'address_en', type: 'text', nullable: true })
  addressEn: string;

  @Column({ name: 'address_ar', type: 'text', nullable: true })
  addressAr: string;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ type: 'enum', enum: Country, nullable: true })
  country: Country;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}