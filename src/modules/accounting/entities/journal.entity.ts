import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Company } from '../../companies/entities/company.entity';
import { JournalLine } from './journal-line.entity';

export enum JournalSource {
  INVOICE = 'invoice',
  PAYMENT = 'payment',
  EXPENSE = 'expense',
  MANUAL = 'manual'
}

@Entity('journals')
export class Journal extends BaseEntity {
  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ type: 'date' })
  date: Date;

  @Column({ length: 255, nullable: true })
  reference: string;

  @Column({ type: 'text', nullable: true })
  memo: string;

  @Column({ type: 'enum', enum: JournalSource })
  source: JournalSource;

  @Column({ name: 'created_by', type: 'uuid' })
  createdBy: string;

  @Column({ name: 'updated_by', type: 'uuid' })
  updatedBy: string;

  @OneToMany(() => JournalLine, line => line.journal, { cascade: true })
  lines: JournalLine[];
}