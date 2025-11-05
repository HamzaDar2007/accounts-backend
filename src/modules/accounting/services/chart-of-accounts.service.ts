import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../entities/account.entity';

@Injectable()
export class ChartOfAccountsService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async initializeChartOfAccounts(companyId: string): Promise<void> {
    const defaultAccounts = [
      // Assets
      { accountCode: '1000', accountNameEn: 'Cash', accountType: 'asset' as any },
      { accountCode: '1200', accountNameEn: 'Accounts Receivable', accountType: 'asset' as any },
      { accountCode: '1300', accountNameEn: 'Inventory', accountType: 'asset' as any },
      
      // Liabilities
      { accountCode: '2000', accountNameEn: 'Accounts Payable', accountType: 'liability' as any },
      { accountCode: '2100', accountNameEn: 'VAT Payable', accountType: 'liability' as any },
      
      // Equity
      { accountCode: '3000', accountNameEn: 'Owner Equity', accountType: 'equity' as any },
      { accountCode: '3100', accountNameEn: 'Retained Earnings', accountType: 'equity' as any },
      
      // Revenue
      { accountCode: '4000', accountNameEn: 'Sales Revenue', accountType: 'revenue' as any },
      
      // Expenses
      { accountCode: '5000', accountNameEn: 'Cost of Goods Sold', accountType: 'expense' as any },
    ];

    for (const accountData of defaultAccounts) {
      const existingAccount = await this.accountRepository.findOne({
        where: { companyId, accountCode: accountData.accountCode }
      });

      if (!existingAccount) {
        const account = this.accountRepository.create({
          ...accountData,
          companyId,
          isActive: true,
        });
        await this.accountRepository.save(account);
      }
    }
  }

  async getAccountByCode(companyId: string, code: string): Promise<Account> {
    return this.accountRepository.findOne({
      where: { companyId, accountCode: code, isActive: true }
    }) as Promise<Account>;
  }

  async getAccountsByType(companyId: string, type: string): Promise<Account[]> {
    return this.accountRepository.find({
      where: { companyId, accountType: type as any, isActive: true },
      order: { accountCode: 'ASC' }
    });
  }

  async createAccount(companyId: string, accountData: any): Promise<Account> {
    const account = this.accountRepository.create({
      companyId,
      accountCode: accountData.accountCode,
      accountNameEn: accountData.accountNameEn,
      accountNameAr: accountData.accountNameAr,
      accountType: accountData.accountType,
      accountSubtype: accountData.accountSubtype,
      isActive: true,
    });
    return this.accountRepository.save(account);
  }
}