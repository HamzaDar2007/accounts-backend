import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Faq } from './faq.entity';

@Entity('faq_categories')
export class FaqCategory extends BaseEntity {
  @Column({ name: 'title_en', length: 255 })
  titleEn: string;

  @Column({ name: 'title_ar', length: 255, nullable: true })
  titleAr: string;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => Faq, faq => faq.category)
  faqs: Faq[];
}