import { Controller, Get, Param, UseGuards, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiProduces,
} from '@nestjs/swagger';
import { QrCodeService } from './qr-code.service';
import { InvoicesService } from '../invoices/invoices.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';

@ApiTags('QR Code')
@ApiBearerAuth('JWT-auth')
@Controller('qr-code')
@UseGuards(JwtAuthGuard)
export class QrCodeController {
  constructor(
    private readonly qrCodeService: QrCodeService,
    private readonly invoicesService: InvoicesService,
  ) {}

  @Get('invoice/:id/zatca')
  @ApiOperation({ summary: 'Generate ZATCA compliant QR code for invoice' })
  @ApiParam({ name: 'id', description: 'Invoice ID' })
  @ApiQuery({ name: 'format', enum: ['png', 'dataurl'], required: false, description: 'QR code format' })
  @ApiResponse({ status: 200, description: 'ZATCA QR code generated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  async generateZATCAQRCode(
    @Param('id') invoiceId: string,
    @CurrentTenant() companyId: string,
    @Query('format') format: 'png' | 'dataurl' = 'dataurl',
  ) {
    const invoice = await this.invoicesService.findOne(invoiceId, companyId);
    
    if (format === 'png') {
      const qrBuffer = await this.qrCodeService.generateZATCAQRBuffer(invoice);
      return {
        qrCode: qrBuffer.toString('base64'),
        format: 'base64',
        type: 'image/png',
      };
    }

    const qrDataURL = await this.qrCodeService.generateZATCAQRCode(invoice);
    return {
      qrCode: qrDataURL,
      format: 'dataurl',
      compliance: 'ZATCA KSA',
    };
  }

  @Get('invoice/:id/zatca/image')
  @ApiOperation({ summary: 'Get ZATCA QR code as PNG image' })
  @ApiParam({ name: 'id', description: 'Invoice ID' })
  @ApiProduces('image/png')
  @ApiResponse({ status: 200, description: 'QR code image returned successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  async getZATCAQRImage(
    @Param('id') invoiceId: string,
    @CurrentTenant() companyId: string,
    @Res() res: Response,
  ) {
    const invoice = await this.invoicesService.findOne(invoiceId, companyId);
    const qrBuffer = await this.qrCodeService.generateZATCAQRBuffer(invoice);

    res.set({
      'Content-Type': 'image/png',
      'Content-Length': qrBuffer.length,
    });

    res.send(qrBuffer);
  }

  @Get('generate')
  @ApiOperation({ summary: 'Generate custom QR code' })
  @ApiQuery({ name: 'data', description: 'Data to encode in QR code', example: 'Hello World' })
  @ApiResponse({ status: 200, description: 'Custom QR code generated successfully' })
  @ApiResponse({ status: 400, description: 'Data parameter is required' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async generateCustomQRCode(@Query('data') data: string) {
    if (!data) {
      return { error: 'Data parameter is required' };
    }

    const qrDataURL = await this.qrCodeService.generateSimpleQRCode(data);
    return {
      qrCode: qrDataURL,
      format: 'dataurl',
    };
  }
}