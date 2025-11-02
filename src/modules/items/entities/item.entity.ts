import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Company } from '../../companies/entities/company.entity';

export enum ItemType {
  PRODUCT = 'product',
  SERVICE = 'service'
}

@Entity('items')
export class Item extends BaseEntity {
  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'name_en', length: 255 })
  nameEn: string;

  @Column({ name: 'name_ar', length: 255, nullable: true })
  nameAr: string;

  @Column({ name: 'description_en', type: 'text', nullable: true })
  descriptionEn: string;

  @Column({ name: 'description_ar', type: 'text', nullable: true })
  descriptionAr: string;

  @Column({ name: 'item_type', type: 'enum', enum: ItemType })
  itemType: ItemType;

  @Column({ name: 'unit_price', type: 'decimal', precision: 18, scale: 2 })
  unitPrice: number;

  @Column({ name: 'cost_price', type: 'decimal', precision: 18, scale: 2, nullable: true })
  costPrice: number;

  @Column({ name: 'tax_rate', type: 'decimal', precision: 5, scale: 2, nullable: true })
  taxRate: number;

  @Column({ name: 'is_taxable', type: 'boolean', default: true })
  isTaxable: boolean;

  @Column({ length: 100, nullable: true })
  category: string;

  @Column({ length: 100, nullable: true })
  sku: string;

  @Column({ name: 'current_stock', type: 'decimal', precision: 18, scale: 3, nullable: true })
  currentStock: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}