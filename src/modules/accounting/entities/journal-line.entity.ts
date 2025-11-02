import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Journal } from './journal.entity';
import { Account } from './account.entity';

@Entity('journal_lines')
export class JournalLine extends BaseEntity {
  @Column({ name: 'journal_id', type: 'uuid' })
  journalId: string;

  @ManyToOne(() => Journal, journal => journal.lines, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'journal_id' })
  journal: Journal;

  @Column({ name: 'account_id', type: 'uuid' })
  accountId: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  debit: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  credit: number;

  @Column({ name: 'entity_ref', type: 'jsonb', nullable: true })
  entityRef: object;
}