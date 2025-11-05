import { IsString, IsOptional, IsNumber, Min, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSettingsDto {
  @ApiProperty({ description: 'Invoice number prefix', example: 'INV', required: false })
  @IsOptional()
  @IsString()
  invoicePrefix?: string;

  @ApiProperty({ description: 'Next invoice number', example: 1001, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  nextInvoiceNumber?: number;

  @ApiProperty({ description: 'Default invoice due days', example: 30, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  invoiceDueDays?: number;

  @ApiProperty({ description: 'Invoice footer text (English)', example: 'Thank you for your business!', required: false })
  @IsOptional()
  @IsString()
  invoiceFooter?: string;

  @ApiProperty({ description: 'Invoice footer text (Arabic)', example: 'شكراً لتعاملكم معنا!', required: false })
  @IsOptional()
  @IsString()
  invoiceFooterAr?: string;

  @ApiProperty({ description: 'Email signature (English)', example: 'Best regards,\nAcme Corporation', required: false })
  @IsOptional()
  @IsString()
  emailSignature?: string;

  @ApiProperty({ description: 'Email signature (Arabic)', example: 'مع أطيب التحيات،\nشركة أكمي', required: false })
  @IsOptional()
  @IsString()
  emailSignatureAr?: string;

  @ApiProperty({ description: 'Default payment terms in days', example: 30, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  defaultPaymentTerms?: number;

  @ApiProperty({ description: 'Enable WhatsApp invoicing feature', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  enableWhatsappInvoicing?: boolean;

  @ApiProperty({ description: 'Enable payroll module', example: false, required: false })
  @IsOptional()
  @IsBoolean()
  enablePayrollModule?: boolean;

  @ApiProperty({ description: 'Enable corporate tax module', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  enableCorporateTax?: boolean;
}