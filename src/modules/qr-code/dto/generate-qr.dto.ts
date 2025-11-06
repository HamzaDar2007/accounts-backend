import { IsString, IsUUID, IsOptional, IsEnum } from 'class-validator';

export enum QrType {
  ZATCA_INVOICE = 'zatca_invoice',
  PAYMENT_LINK = 'payment_link',
  CUSTOM = 'custom'
}

export class GenerateQrDto {
  @IsEnum(QrType)
  qrType: QrType;

  @IsUUID()
  invoiceId: string;

  @IsOptional()
  @IsString()
  customData?: string;
}