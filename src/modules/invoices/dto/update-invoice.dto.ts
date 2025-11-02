// import { PartialType } from '@nestjs/mapped-types';
import { CreateInvoiceDto } from './create-invoice.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { InvoiceStatus } from '../../../common/enums/country.enum';

export class UpdateInvoiceDto {
  @ApiProperty({ description: 'Customer ID', example: '123e4567-e89b-12d3-a456-426614174000', required: false })
  customerId?: string;
  
  @ApiProperty({ description: 'Invoice date', example: '2024-01-15T00:00:00.000Z', required: false })
  invoiceDate?: string;
  
  @ApiProperty({ description: 'Due date', example: '2024-02-15T00:00:00.000Z', required: false })
  dueDate?: string;
  
  @ApiProperty({ description: 'Discount amount', example: 50.00, required: false })
  discountAmount?: number;
  
  @ApiProperty({ description: 'Payment method', example: 'Bank Transfer', required: false })
  paymentMethod?: string;
  
  @ApiProperty({ description: 'Notes in English', example: 'Updated payment terms', required: false })
  notesEn?: string;
  
  @ApiProperty({ description: 'Notes in Arabic', example: 'شروط دفع محدثة', required: false })
  notesAr?: string;
  
  @ApiProperty({ description: 'Invoice status', enum: InvoiceStatus, example: InvoiceStatus.PAID, required: false })
  @IsOptional()
  @IsEnum(InvoiceStatus)
  status?: InvoiceStatus;
}