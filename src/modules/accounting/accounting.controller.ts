import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { AccountingService } from './accounting.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/enums/country.enum';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';

@ApiTags('Accounting')
@ApiBearerAuth('JWT-auth')
@Controller('accounting')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AccountingController {
  constructor(private readonly accountingService: AccountingService) {}

  @Get('accounts')
  @Roles(UserRole.OWNER, UserRole.ACCOUNTANT)
  @ApiOperation({ summary: 'Get chart of accounts' })
  @ApiResponse({ status: 200, description: 'Chart of accounts returned successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Owner or Accountant role required' })
  getAccounts(@CurrentTenant() companyId: string) {
    return this.accountingService.getAccounts(companyId);
  }

  @Post('accounts')
  @Roles(UserRole.OWNER, UserRole.ACCOUNTANT)
  @ApiOperation({ summary: 'Create account' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        accountCode: { type: 'string', example: '1001' },
        accountNameEn: { type: 'string', example: 'Cash' },
        accountNameAr: { type: 'string', example: 'النقد' },
        accountType: { type: 'string', enum: ['asset', 'liability', 'equity', 'revenue', 'expense'] },
        accountSubtype: { type: 'string', example: 'current_asset' }
      },
      required: ['accountCode', 'accountNameEn', 'accountType']
    }
  })
  @ApiResponse({ status: 201, description: 'Account created successfully' })
  createAccount(@Body() body: any, @CurrentTenant() companyId: string) {
    return this.accountingService.createAccount(companyId, body);
  }

  @Get('journal-entries')
  @Roles(UserRole.OWNER, UserRole.ACCOUNTANT)
  @ApiOperation({ summary: 'Get journal entries' })
  @ApiResponse({ status: 200, description: 'Journal entries returned successfully' })
  getJournalEntries(@CurrentTenant() companyId: string) {
    return this.accountingService.getJournalEntries(companyId);
  }

  @Get('trial-balance')
  @Roles(UserRole.OWNER, UserRole.ACCOUNTANT)
  @ApiOperation({ summary: 'Get trial balance' })
  @ApiResponse({ status: 200, description: 'Trial balance retrieved successfully' })
  getTrialBalance(@CurrentTenant() companyId: string) {
    return this.accountingService.getTrialBalance(companyId);
  }

  @Get('validate-equation')
  @Roles(UserRole.OWNER, UserRole.ACCOUNTANT)
  @ApiOperation({ summary: 'Validate accounting equation' })
  @ApiResponse({ status: 200, description: 'Accounting equation validation result' })
  validateAccountingEquation(@CurrentTenant() companyId: string) {
    return this.accountingService.validateAccountingEquation(companyId);
  }

  @Get('balance-sheet')
  @Roles(UserRole.OWNER, UserRole.ACCOUNTANT)
  @ApiOperation({ summary: 'Generate balance sheet' })
  @ApiResponse({ status: 200, description: 'Balance sheet generated successfully' })
  getBalanceSheet(@CurrentTenant() companyId: string) {
    return this.accountingService.getBalanceSheet(companyId);
  }

  @Post('journal-entries')
  @Roles(UserRole.OWNER, UserRole.ACCOUNTANT)
  @ApiOperation({ summary: 'Create journal entry' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        entryDate: { type: 'string', format: 'date' },
        entryType: { type: 'string', example: 'manual' },
        descriptionEn: { type: 'string', example: 'Manual journal entry' },
        lines: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              accountId: { type: 'string' },
              debitAmount: { type: 'number' },
              creditAmount: { type: 'number' },
              descriptionEn: { type: 'string' }
            }
          }
        }
      },
      required: ['entryDate', 'entryType', 'descriptionEn', 'lines']
    }
  })
  @ApiResponse({ status: 201, description: 'Journal entry created successfully' })
  createJournalEntry(@Body() body: any, @CurrentTenant() companyId: string, @CurrentUser() user: JwtPayload) {
    return this.accountingService.createJournalEntry(companyId, body, user.sub);
  }
}