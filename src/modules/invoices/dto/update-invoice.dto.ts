// import { PartialType } from '@nestjs/mapped-types';
import { CreateInvoiceDto } from './create-invoice.dto';
import { IsEnum, IsOptional, IsString, IsNumber, IsDateString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { InvoiceStatus } from '../../../common/enums/country.enum';

export class UpdateInvoiceDto {
  @ApiProperty({ description: 'Customer ID', example: '123e4567-e89b-12d3-a456-426614174000', required: false })
  @IsOptional()
  @IsUUID()
  customerId?: string;
  
  @ApiProperty({ description: 'Invoice date', example: '2024-01-15T00:00:00.000Z', required: false })
  @IsOptional()
  @IsDateString()
  invoiceDate?: string;
  
  @ApiProperty({ description: 'Due date', example: '2024-02-15T00:00:00.000Z', required: false })
  @IsOptional()
  @IsDateString()
  dueDate?: string;
  
  @ApiProperty({ description: 'Discount amount', example: 50.00, required: false })
  @IsOptional()
  @IsNumber()
  discountAmount?: number;
  
  @ApiProperty({ description: 'Payment method', example: 'Bank Transfer', required: false })
  @IsOptional()
  @IsString()
  paymentMethod?: string;
  
  @ApiProperty({ description: 'Notes in English', example: 'Updated payment terms', required: false })
  @IsOptional()
  @IsString()
  notesEn?: string;
  
  @ApiProperty({ description: 'Notes in Arabic', example: 'شروط دفع محدثة', required: false })
  @IsOptional()
  @IsString()
  notesAr?: string;
  
  @ApiProperty({ description: 'Notes', example: 'Updated payment terms', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
  
  @ApiProperty({ description: 'Total discount amount', example: 100.00, required: false })
  @IsOptional()
  @IsNumber()
  discountTotal?: number;
  
  @ApiProperty({ description: 'Invoice status', enum: InvoiceStatus, example: InvoiceStatus.PAID, required: false })
  @IsOptional()
  @IsEnum(InvoiceStatus)
  status?: InvoiceStatus;
}