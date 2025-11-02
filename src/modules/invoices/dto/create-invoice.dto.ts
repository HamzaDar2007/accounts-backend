import { IsString, IsUUID, IsDateString, IsArray, IsOptional, IsNumber, Min, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Currency } from '../../../common/enums/country.enum';

export class CreateInvoiceLineDto {
  @ApiProperty({ description: 'Item ID (optional)', example: '123e4567-e89b-12d3-a456-426614174000', required: false })
  @IsOptional()
  @IsUUID()
  itemId?: string;

  @ApiProperty({ description: 'Item description in English', example: 'Professional consulting services' })
  @IsString()
  descriptionEn: string;

  @ApiProperty({ description: 'Item description in Arabic (optional)', example: 'خدمات استشارية مهنية', required: false })
  @IsOptional()
  @IsString()
  descriptionAr?: string;

  @ApiProperty({ description: 'Quantity', example: 2.5, minimum: 0.01 })
  @IsNumber()
  @Min(0.01)
  quantity: number;

  @ApiProperty({ description: 'Unit price', example: 100.00, minimum: 0 })
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @ApiProperty({ description: 'Discount amount (optional)', example: 10.00, minimum: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountAmount?: number;

  @ApiProperty({ description: 'Tax rate percentage', example: 5, minimum: 0 })
  @IsNumber()
  @Min(0)
  taxRatePercent: number;
}

export class CreateInvoiceDto {
  @ApiProperty({ description: 'Customer ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  customerId: string;

  @ApiProperty({ description: 'Invoice issue date', example: '2024-01-15T00:00:00.000Z' })
  @IsDateString()
  issueDate: string;

  @ApiProperty({ description: 'Invoice due date', example: '2024-02-15T00:00:00.000Z' })
  @IsDateString()
  dueDate: string;

  @ApiProperty({ description: 'Invoice currency', enum: Currency, example: Currency.AED })
  @IsEnum(Currency)
  currency: Currency;

  @ApiProperty({ description: 'Total discount amount (optional)', example: 50.00, minimum: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountTotal?: number;

  @ApiProperty({ description: 'Invoice notes in English (optional)', example: 'Payment due within 30 days', required: false })
  @IsOptional()
  @IsString()
  notesEn?: string;

  @ApiProperty({ description: 'Invoice notes in Arabic (optional)', example: 'الدفع مطلوب خلال 30 يوم', required: false })
  @IsOptional()
  @IsString()
  notesAr?: string;

  @ApiProperty({ description: 'Payment method note (optional)', example: 'Bank transfer preferred', required: false })
  @IsOptional()
  @IsString()
  paymentMethodNote?: string;

  @ApiProperty({ description: 'Invoice line items', type: [CreateInvoiceLineDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceLineDto)
  lines: CreateInvoiceLineDto[];
}