import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountingService } from './accounting.service';
import { AccountingController } from './accounting.controller';
import { JournalEntryService } from './services/journal-entry.service';
import { ChartOfAccountsService } from './services/chart-of-accounts.service';
import { BalanceSheetService } from './services/balance-sheet.service';
import { Account } from './entities/account.entity';
import { JournalEntry } from './entities/journal-entry.entity';
import { JournalEntryLine } from './entities/journal-entry-line.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Account,
      JournalEntry,
      JournalEntryLine,
    ]),
  ],
  controllers: [AccountingController],
  providers: [
    AccountingService,
    JournalEntryService,
    ChartOfAccountsService,
    BalanceSheetService,
  ],
  exports: [AccountingService],
})
export class AccountingModule {}