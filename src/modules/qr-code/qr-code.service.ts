import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Invoice } from '../invoices/entities/invoice.entity';
const QRCode = require('qrcode');

@Injectable()
export class QrCodeService {
  constructor(private configService: ConfigService) {}

  async generateZATCAQRCode(invoice: Invoice): Promise<string> {
    const qrData = this.buildZATCAQRData(invoice);
    const qrCodeDataURL = await QRCode.toDataURL(qrData);
    return qrCodeDataURL;
  }

  async generateZATCAQRBuffer(invoice: Invoice): Promise<Buffer> {
    const qrData = this.buildZATCAQRData(invoice);
    const qrCodeBuffer = await QRCode.toBuffer(qrData);
    return qrCodeBuffer;
  }

  private buildZATCAQRData(invoice: Invoice): string {
    // ZATCA QR Code format for KSA e-invoicing
    const sellerName = invoice.company.nameEn;
    const vatNumber = invoice.company.taxRegistrationNumber || this.configService.get('ZATCA_VAT_NUMBER') || '';
    const timestamp = invoice.issueDate.toISOString();
    const totalAmount = invoice.totalAmount.toFixed(2);
    const vatAmount = invoice.taxAmount.toFixed(2);

    // Build TLV (Tag-Length-Value) format for ZATCA
    const tlvData = [
      this.buildTLV(1, sellerName), // Seller name
      this.buildTLV(2, vatNumber), // VAT registration number
      this.buildTLV(3, timestamp), // Invoice timestamp
      this.buildTLV(4, totalAmount), // Invoice total (with VAT)
      this.buildTLV(5, vatAmount), // VAT amount
    ].join('');

    // Convert to base64
    return Buffer.from(tlvData, 'hex').toString('base64');
  }

  private buildTLV(tag: number, value: string): string {
    const tagHex = tag.toString(16).padStart(2, '0');
    const valueBytes = Buffer.from(value, 'utf8');
    const lengthHex = valueBytes.length.toString(16).padStart(2, '0');
    const valueHex = valueBytes.toString('hex');
    
    return tagHex + lengthHex + valueHex;
  }

  generateSimpleQRCode(data: string): Promise<string> {
    return QRCode.toDataURL(data);
  }

  generateQRCodeBuffer(data: string): Promise<Buffer> {
    return QRCode.toBuffer(data);
  }
}