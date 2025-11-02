import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JournalEntry } from '../entities/journal-entry.entity';
import { JournalEntryLine } from '../entities/journal-entry-line.entity';
import { Account } from '../entities/account.entity';

export interface JournalEntryLineDto {
  accountId: string;
  debitAmount?: number;
  creditAmount?: number;
  description?: string;
}

export interface CreateJournalEntryDto {
  companyId: string;
  description: string;
  referenceType: string;
  referenceId: string;
  lines: JournalEntryLineDto[];
}

@Injectable()
export class JournalEntryService {
  constructor(
    @InjectRepository(JournalEntry)
    private journalEntryRepository: Repository<JournalEntry>,
    @InjectRepository(JournalEntryLine)
    private journalEntryLineRepository: Repository<JournalEntryLine>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async createJournalEntry(dto: CreateJournalEntryDto): Promise<JournalEntry> {
    // Validate debit/credit balance
    const totalDebits = dto.lines.reduce((sum, line) => sum + (line.debitAmount || 0), 0);
    const totalCredits = dto.lines.reduce((sum, line) => sum + (line.creditAmount || 0), 0);
    
    if (Math.abs(totalDebits - totalCredits) > 0.01) {
      throw new BadRequestException('Debits must equal credits');
    }

    // Create journal entry
    const journalEntry = this.journalEntryRepository.create({
      companyId: dto.companyId,
      descriptionEn: dto.description,
      sourceType: dto.referenceType as any,
      sourceId: dto.referenceId,
      entryType: 'system_generated' as any,
      entryDate: new Date(),
      totalDebit: totalDebits,
      totalCredit: totalCredits,
      entryNumber: `JE-${Date.now()}`,
      createdBy: 'system',
    });

    const savedEntry = await this.journalEntryRepository.save(journalEntry);

    // Create journal entry lines
    const lines = dto.lines.map(line => 
      this.journalEntryLineRepository.create({
        journalEntry: savedEntry,
        account: { id: line.accountId } as any,
        debitAmount: line.debitAmount || 0,
        creditAmount: line.creditAmount || 0,
        descriptionEn: line.description || dto.description,
      })
    );

    await this.journalEntryLineRepository.save(lines);
    
    return this.journalEntryRepository.findOne({
      where: { id: savedEntry.id },
      relations: ['lines', 'lines.account'],
    }) as Promise<JournalEntry>;
  }

  async getTrialBalance(companyId: string): Promise<any[]> {
    const result = await this.journalEntryLineRepository
      .createQueryBuilder('jel')
      .innerJoin('jel.journalEntry', 'je')
      .innerJoin('jel.account', 'acc')
      .select([
        'acc.id as accountId',
        'acc.name as accountName',
        'acc.type as accountType',
        'SUM(jel.debitAmount) as totalDebits',
        'SUM(jel.creditAmount) as totalCredits',
        '(SUM(jel.debitAmount) - SUM(jel.creditAmount)) as balance'
      ])
      .where('je.companyId = :companyId', { companyId })
      .groupBy('acc.id, acc.name, acc.type')
      .getRawMany();

    return result;
  }

  async validateAccountingEquation(companyId: string): Promise<{ isValid: boolean; assets: number; liabilities: number; equity: number }> {
    const trialBalance = await this.getTrialBalance(companyId);
    
    let assets = 0;
    let liabilities = 0;
    let equity = 0;

    trialBalance.forEach(account => {
      const balance = parseFloat(account.balance);
      switch (account.accountType) {
        case 'asset':
          assets += balance;
          break;
        case 'liability':
          liabilities += Math.abs(balance);
          break;
        case 'equity':
          equity += Math.abs(balance);
          break;
      }
    });

    const isValid = Math.abs(assets - (liabilities + equity)) < 0.01;
    
    return { isValid, assets, liabilities, equity };
  }
}