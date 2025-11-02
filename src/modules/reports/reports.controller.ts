import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { UserRole } from '../../common/enums/country.enum';

@ApiTags('Reports')
@ApiBearerAuth('JWT-auth')
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('tax')
  @Roles(UserRole.OWNER, UserRole.ACCOUNTANT)
  @ApiOperation({ summary: 'Get tax reports' })
  @ApiQuery({ name: 'period', required: false, description: 'Report period (monthly, quarterly, yearly)' })
  @ApiResponse({ status: 200, description: 'Tax reports returned successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Owner or Accountant role required' })
  getTaxReports(@CurrentTenant() companyId: string, @Query('period') period?: string) {
    return this.reportsService.getTaxReports(companyId, period);
  }

  @Post('tax/generate')
  @Roles(UserRole.OWNER, UserRole.ACCOUNTANT)
  @ApiOperation({ summary: 'Generate tax report' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        reportType: { type: 'string', enum: ['monthly', 'quarterly', 'yearly'] },
        periodStart: { type: 'string', format: 'date' },
        periodEnd: { type: 'string', format: 'date' }
      },
      required: ['reportType', 'periodStart', 'periodEnd']
    }
  })
  @ApiResponse({ status: 201, description: 'Tax report generated successfully' })
  generateTaxReport(@Body() body: any, @CurrentTenant() companyId: string) {
    return this.reportsService.generateTaxReport(companyId, body);
  }

  @Get('sales')
  @ApiOperation({ summary: 'Get sales reports' })
  @ApiResponse({ status: 200, description: 'Sales reports returned successfully' })
  getSalesReports(@CurrentTenant() companyId: string) {
    return this.reportsService.getSalesReports(companyId);
  }

  @Get('financial')
  @Roles(UserRole.OWNER, UserRole.ACCOUNTANT)
  @ApiOperation({ summary: 'Get financial reports' })
  @ApiResponse({ status: 200, description: 'Financial reports returned successfully' })
  getFinancialReports(@CurrentTenant() companyId: string) {
    return this.reportsService.getFinancialReports(companyId);
  }
}