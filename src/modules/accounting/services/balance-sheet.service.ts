import { Injectable } from '@nestjs/common';
import { JournalEntryService } from './journal-entry.service';

@Injectable()
export class BalanceSheetService {
  constructor(private journalEntryService: JournalEntryService) {}

  async generateBalanceSheet(companyId: string) {
    const trialBalance = await this.journalEntryService.getTrialBalance(companyId);
    
    const assets = trialBalance.filter(account => account.accountType === 'asset');
    const liabilities = trialBalance.filter(account => account.accountType === 'liability');
    const equity = trialBalance.filter(account => account.accountType === 'equity');
    
    const totalAssets = assets.reduce((sum, account) => sum + parseFloat(account.balance), 0);
    const totalLiabilities = liabilities.reduce((sum, account) => sum + Math.abs(parseFloat(account.balance)), 0);
    const totalEquity = equity.reduce((sum, account) => sum + Math.abs(parseFloat(account.balance)), 0);
    
    const isBalanced = Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01;
    
    return {
      assets: {
        accounts: assets,
        total: totalAssets
      },
      liabilities: {
        accounts: liabilities,
        total: totalLiabilities
      },
      equity: {
        accounts: equity,
        total: totalEquity
      },
      isBalanced,
      equation: {
        assets: totalAssets,
        liabilitiesAndEquity: totalLiabilities + totalEquity,
        difference: totalAssets - (totalLiabilities + totalEquity)
      }
    };
  }
}