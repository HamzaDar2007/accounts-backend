import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Company } from '../../companies/entities/company.entity';
import { JournalEntryLine } from './journal-entry-line.entity';

export enum AccountType {
  ASSET = 'asset',
  LIABILITY = 'liability',
  EQUITY = 'equity',
  REVENUE = 'revenue',
  EXPENSE = 'expense'
}

@Entity('accounts')
export class Account extends BaseEntity {
  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'account_code', length: 20 })
  accountCode: string;

  @Column({ name: 'account_name_en', length: 255 })
  accountNameEn: string;

  @Column({ name: 'account_name_ar', length: 255, nullable: true })
  accountNameAr: string;

  @Column({ name: 'account_type', type: 'enum', enum: AccountType })
  accountType: AccountType;

  @Column({ name: 'account_subtype', length: 100, nullable: true })
  accountSubtype: string;

  @Column({ name: 'parent_account_id', type: 'uuid', nullable: true })
  parentAccountId: string;

  @ManyToOne(() => Account, { nullable: true })
  @JoinColumn({ name: 'parent_account_id' })
  parentAccount: Account;

  @OneToMany(() => Account, account => account.parentAccount)
  childAccounts: Account[];

  @Column({ name: 'is_system_account', type: 'boolean', default: false })
  isSystemAccount: boolean;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => JournalEntryLine, line => line.account)
  journalEntryLines: JournalEntryLine[];
}