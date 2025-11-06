import { IsString, IsDateString, IsOptional, IsEnum } from 'class-validator';

export enum ReportType {
  INVOICE_SUMMARY = 'invoice_summary',
  PAYMENT_SUMMARY = 'payment_summary',
  VAT_REPORT = 'vat_report',
  CUSTOMER_STATEMENT = 'customer_statement'
}

export class GenerateReportDto {
  @IsEnum(ReportType)
  reportType: ReportType;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsString()
  customerId?: string;

  @IsOptional()
  @IsString()
  format?: string;
}