import { IsString, IsUUID, IsOptional, IsEnum } from 'class-validator';

export enum PdfType {
  INVOICE = 'invoice',
  RECEIPT = 'receipt',
  STATEMENT = 'statement'
}

export class GeneratePdfDto {
  @IsEnum(PdfType)
  pdfType: PdfType;

  @IsUUID()
  entityId: string;

  @IsOptional()
  @IsString()
  templateId?: string;

  @IsOptional()
  @IsString()
  language?: string;
}