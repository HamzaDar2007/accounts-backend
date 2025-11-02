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
import { PdfGenerationService } from './pdf-generation.service';
import { InvoicesService } from '../invoices/invoices.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { Language } from '../../common/enums/country.enum';

@ApiTags('PDF Generation')
@ApiBearerAuth('JWT-auth')
@Controller('pdf')
@UseGuards(JwtAuthGuard)
export class PdfGenerationController {
  constructor(
    private readonly pdfGenerationService: PdfGenerationService,
    private readonly invoicesService: InvoicesService,
  ) {}

  @Get('invoice/:id')
  @ApiOperation({ summary: 'Generate and download invoice PDF' })
  @ApiParam({ name: 'id', description: 'Invoice ID' })
  @ApiQuery({ name: 'lang', enum: Language, required: false, description: 'Language for PDF generation' })
  @ApiProduces('application/pdf')
  @ApiResponse({ status: 200, description: 'PDF generated and downloaded successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  async generateInvoicePDF(
    @Param('id') invoiceId: string,
    @CurrentTenant() companyId: string,
    @Query('lang') language: Language = Language.EN,
    @Res() res: Response,
  ) {
    const invoice = await this.invoicesService.findOne(invoiceId, companyId);
    const pdfBuffer = await this.pdfGenerationService.generateInvoicePdf(invoice, language);

    const filename = `invoice-${invoice.invoiceNumber}-${language}.pdf`;
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  }

  @Get('invoice/:id/preview')
  @ApiOperation({ summary: 'Preview invoice PDF in browser' })
  @ApiParam({ name: 'id', description: 'Invoice ID' })
  @ApiQuery({ name: 'lang', enum: Language, required: false, description: 'Language for PDF generation' })
  @ApiProduces('application/pdf')
  @ApiResponse({ status: 200, description: 'PDF preview generated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  async previewInvoicePDF(
    @Param('id') invoiceId: string,
    @CurrentTenant() companyId: string,
    @Query('lang') language: Language = Language.EN,
    @Res() res: Response,
  ) {
    const invoice = await this.invoicesService.findOne(invoiceId, companyId);
    const pdfBuffer = await this.pdfGenerationService.generateInvoicePdf(invoice, language);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline',
    });

    res.send(pdfBuffer);
  }
}