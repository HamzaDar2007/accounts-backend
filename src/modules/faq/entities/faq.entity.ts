import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { FaqCategory } from './faq-category.entity';

@Entity('faqs')
export class Faq extends BaseEntity {
  @Column({ name: 'category_id', type: 'uuid' })
  categoryId: string;

  @ManyToOne(() => FaqCategory, category => category.faqs)
  @JoinColumn({ name: 'category_id' })
  category: FaqCategory;

  @Column({ name: 'question_en', type: 'text' })
  questionEn: string;

  @Column({ name: 'question_ar', type: 'text', nullable: true })
  questionAr: string;

  @Column({ name: 'answer_en', type: 'text' })
  answerEn: string;

  @Column({ name: 'answer_ar', type: 'text', nullable: true })
  answerAr: string;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}