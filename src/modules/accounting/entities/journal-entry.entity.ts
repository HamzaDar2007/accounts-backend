import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Company } from '../../companies/entities/company.entity';
import { JournalEntryLine } from './journal-entry-line.entity';

export enum EntryType {
  MANUAL = 'manual',
  SYSTEM_GENERATED = 'system_generated'
}

export enum SourceType {
  INVOICE = 'invoice',
  PAYMENT = 'payment',
  ADJUSTMENT = 'adjustment'
}

@Entity('journal_entries')
export class JournalEntry extends BaseEntity {
  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'entry_number', length: 50 })
  entryNumber: string;

  @Column({ name: 'entry_date', type: 'date' })
  entryDate: Date;

  @Column({ name: 'entry_type', type: 'enum', enum: EntryType })
  entryType: EntryType;

  @Column({ name: 'source_type', type: 'enum', enum: SourceType, nullable: true })
  sourceType: SourceType;

  @Column({ name: 'source_id', type: 'uuid', nullable: true })
  sourceId: string | null;

  @Column({ name: 'description_en', type: 'text' })
  descriptionEn: string;

  @Column({ name: 'description_ar', type: 'text', nullable: true })
  descriptionAr: string;

  @Column({ name: 'total_debit', type: 'decimal', precision: 18, scale: 2 })
  totalDebit: number;

  @Column({ name: 'total_credit', type: 'decimal', precision: 18, scale: 2 })
  totalCredit: number;

  @Column({ name: 'created_by', type: 'uuid' })
  createdBy: string;

  @OneToMany(() => JournalEntryLine, line => line.journalEntry, { cascade: true })
  lines: JournalEntryLine[];
}