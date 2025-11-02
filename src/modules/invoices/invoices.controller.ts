import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { InvoiceStatus } from '../../common/enums/country.enum';

@ApiTags('Invoices')
@ApiBearerAuth('JWT-auth')
@Controller('invoices')
@UseGuards(JwtAuthGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  @ApiOperation({ summary: 'Create new invoice' })
  @ApiBody({
    type: CreateInvoiceDto,
    examples: {
      full: {
        summary: 'Full Invoice',
        value: {
          customerId: '123e4567-e89b-12d3-a456-426614174000',
          invoiceType: 'full',
          issueDate: '2024-01-15',
          dueDate: '2024-02-15',
          supplyDate: '2024-01-15',
          currency: 'AED',
          exchangeRate: 1.0,
          discountTotal: 0,
          notes: 'Thank you for your business',
          lines: [
            {
              itemId: '456e7890-e89b-12d3-a456-426614174000',
              description: 'Laptop Computer',
              quantity: 2,
              unitPrice: 2500.0,
              taxRatePercent: 5.0,
              discountAmount: 0,
            },
          ],
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Invoice created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(
    @Body() createInvoiceDto: CreateInvoiceDto,
    @CurrentTenant() companyId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.invoicesService.create(createInvoiceDto, companyId, user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Get all invoices' })
  @ApiQuery({
    name: 'status',
    enum: InvoiceStatus,
    required: false,
    description: 'Filter by invoice status',
  })
  @ApiResponse({
    status: 200,
    description: 'Invoices list returned successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(
    @CurrentTenant() companyId: string,
    @Query('status') status?: InvoiceStatus,
  ) {
    return this.invoicesService.findAll(companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get invoice by ID' })
  @ApiParam({ name: 'id', description: 'Invoice ID' })
  @ApiResponse({ status: 200, description: 'Invoice returned successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  findOne(@Param('id') id: string, @CurrentTenant() companyId: string) {
    return this.invoicesService.findOne(id, companyId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update invoice' })
  @ApiParam({ name: 'id', description: 'Invoice UUID' })
  @ApiBody({
    type: UpdateInvoiceDto,
    examples: {
      update: {
        summary: 'Update Invoice',
        value: {
          dueDate: '2024-03-15',
          notes: 'Updated payment terms',
          discountTotal: 100.0,
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Invoice updated successfully' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  update(
    @Param('id') id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
    @CurrentTenant() companyId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.invoicesService.update(
      id,
      updateInvoiceDto,
      companyId,
      user.sub,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete invoice' })
  @ApiParam({ name: 'id', description: 'Invoice ID' })
  @ApiResponse({ status: 200, description: 'Invoice deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  remove(@Param('id') id: string, @CurrentTenant() companyId: string) {
    return this.invoicesService.remove(id, companyId);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update invoice status' })
  @ApiParam({ name: 'id', description: 'Invoice UUID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
        },
      },
      required: ['status'],
    },
    examples: {
      sent: {
        summary: 'Mark as Sent',
        value: { status: 'sent' },
      },
      paid: {
        summary: 'Mark as Paid',
        value: { status: 'paid' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Invoice status updated successfully',
  })
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: InvoiceStatus },
    @CurrentTenant() companyId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.invoicesService.update(
      id,
      { status: body.status },
      companyId,
      user.sub,
    );
  }

  @Post(':id/send')
  @ApiOperation({ summary: 'Mark invoice as sent' })
  @ApiParam({ name: 'id', description: 'Invoice UUID' })
  @ApiResponse({ status: 200, description: 'Invoice marked as sent' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  markAsSent(@Param('id') id: string, @CurrentTenant() companyId: string) {
    return this.invoicesService.markAsSent(id, companyId);
  }

  @Post(':id/mark-paid')
  @ApiOperation({ summary: 'Mark invoice as paid' })
  @ApiParam({ name: 'id', description: 'Invoice UUID' })
  @ApiResponse({ status: 200, description: 'Invoice marked as paid' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  markAsPaid(@Param('id') id: string, @CurrentTenant() companyId: string) {
    return this.invoicesService.markAsPaid(id, companyId);
  }

  @Get(':id/pdf')
  @ApiOperation({ summary: 'Get invoice PDF' })
  @ApiParam({ name: 'id', description: 'Invoice UUID' })
  @ApiQuery({
    name: 'lang',
    enum: ['en', 'ar'],
    required: false,
    description: 'PDF language',
  })
  @ApiResponse({
    status: 200,
    description: 'PDF generated successfully',
    example: { pdfUrl: 'INV-001-en.pdf' },
  })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  getPdf(
    @Param('id') id: string,
    @CurrentTenant() companyId: string,
    @Query('lang') lang: string = 'en',
  ) {
    return this.invoicesService.generatePdf(id, companyId, lang as 'en' | 'ar');
  }

  @Post(':id/duplicate')
  @ApiOperation({ summary: 'Duplicate invoice' })
  @ApiParam({ name: 'id', description: 'Invoice UUID' })
  @ApiResponse({ status: 201, description: 'Invoice duplicated successfully' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  duplicate(
    @Param('id') id: string,
    @CurrentTenant() companyId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.invoicesService.duplicate(id, companyId, user.sub);
  }

  @Get('next-number')
  @ApiOperation({ summary: 'Get next invoice number' })
  @ApiResponse({
    status: 200,
    description: 'Next invoice number returned',
    example: { nextNumber: 'INV-0005' },
  })
  getNextNumber(@CurrentTenant() companyId: string) {
    return this.invoicesService.getNextNumber(companyId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get invoice statistics' })
  @ApiResponse({
    status: 200,
    description: 'Invoice stats returned',
    example: {
      draft: 5,
      sent: 10,
      paid: 25,
      overdue: 3,
      cancelled: 1,
    },
  })
  getStats(@CurrentTenant() companyId: string) {
    return this.invoicesService.getStats(companyId);
  }

  @Post(':id/validate-compliance')
  @ApiOperation({ summary: 'Validate invoice compliance' })
  @ApiParam({ name: 'id', description: 'Invoice UUID' })
  @ApiResponse({
    status: 200,
    description: 'Compliance validation result',
    example: {
      valid: true,
      message: 'Invoice complies with UAE FTA requirements',
    },
  })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  validateCompliance(
    @Param('id') id: string,
    @CurrentTenant() companyId: string,
  ) {
    return this.invoicesService.validateCompliance(id, companyId);
  }
}
