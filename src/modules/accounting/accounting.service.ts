import { Injectable } from '@nestjs/common';
import { JournalEntryService } from './services/journal-entry.service';
import { ChartOfAccountsService } from './services/chart-of-accounts.service';
import { BalanceSheetService } from './services/balance-sheet.service';

@Injectable()
export class AccountingService {
  constructor(
    private journalEntryService: JournalEntryService,
    private chartOfAccountsService: ChartOfAccountsService,
    private balanceSheetService: BalanceSheetService,
  ) {}

  async initializeCompanyAccounting(companyId: string): Promise<void> {
    await this.chartOfAccountsService.initializeChartOfAccounts(companyId);
  }

  async getTrialBalance(companyId: string) {
    return this.journalEntryService.getTrialBalance(companyId);
  }

  async validateAccountingEquation(companyId: string) {
    return this.journalEntryService.validateAccountingEquation(companyId);
  }

  async createInvoiceJournalEntry(companyId: string, invoiceId: string, amount: number, vatAmount: number) {
    const arAccount = await this.chartOfAccountsService.getAccountByCode(companyId, '1200');
    const revenueAccount = await this.chartOfAccountsService.getAccountByCode(companyId, '4000');
    const vatAccount = await this.chartOfAccountsService.getAccountByCode(companyId, '2100');

    return this.journalEntryService.createJournalEntry({
      companyId,
      description: `Invoice ${invoiceId}`,
      referenceType: 'INVOICE',
      referenceId: invoiceId,
      lines: [
        { accountId: arAccount.id, debitAmount: amount + vatAmount },
        { accountId: revenueAccount.id, creditAmount: amount },
        { accountId: vatAccount.id, creditAmount: vatAmount },
      ]
    });
  }

  async createPaymentJournalEntry(companyId: string, paymentId: string, amount: number) {
    const cashAccount = await this.chartOfAccountsService.getAccountByCode(companyId, '1000');
    const arAccount = await this.chartOfAccountsService.getAccountByCode(companyId, '1200');

    return this.journalEntryService.createJournalEntry({
      companyId,
      description: `Payment ${paymentId}`,
      referenceType: 'PAYMENT',
      referenceId: paymentId,
      lines: [
        { accountId: cashAccount.id, debitAmount: amount },
        { accountId: arAccount.id, creditAmount: amount },
      ]
    });
  }

  getAccounts(companyId: string) {
    return this.chartOfAccountsService.getAccountsByType(companyId, 'ASSET');
  }

  createAccount(companyId: string, body: any) {
    return { message: 'Account creation feature coming soon', companyId, body };
  }

  getJournalEntries(companyId: string) {
    return this.journalEntryService.getTrialBalance(companyId);
  }

  createJournalEntry(companyId: string, body: any, userId: string) {
    return this.journalEntryService.createJournalEntry({
      companyId,
      description: body.description,
      referenceType: body.referenceType || 'MANUAL',
      referenceId: body.referenceId || 'MANUAL',
      lines: body.lines
    });
  }

  async getBalanceSheet(companyId: string) {
    return this.balanceSheetService.generateBalanceSheet(companyId);
  }
}