import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';

@ApiTags('Payments')
@ApiBearerAuth('JWT-auth')
@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create payment' })
  @ApiBody({ 
    type: CreatePaymentDto,
    examples: {
      cash: {
        summary: 'Cash Payment',
        value: {
          invoiceId: '123e4567-e89b-12d3-a456-426614174000',
          paymentDate: '2024-01-15',
          amount: 1050.00,
          paymentMethod: 'cash',
          notes: 'Cash payment received'
        }
      },
      bank: {
        summary: 'Bank Transfer',
        value: {
          invoiceId: '123e4567-e89b-12d3-a456-426614174000',
          paymentDate: '2024-01-15',
          amount: 2500.00,
          paymentMethod: 'bank_transfer',
          referenceNumber: 'TXN123456789',
          notes: 'Bank transfer payment'
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Payment created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(
    @Body() createPaymentDto: CreatePaymentDto,
    @CurrentTenant() companyId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.paymentsService.create(createPaymentDto, companyId, user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Get all payments' })
  @ApiResponse({ status: 200, description: 'Payments list returned successfully' })
  findAll(@CurrentTenant() companyId: string) {
    return this.paymentsService.findAll(companyId);
  }

  @Get('invoice/:invoiceId')
  @ApiOperation({ summary: 'Get payments by invoice' })
  @ApiParam({ name: 'invoiceId', description: 'Invoice UUID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Invoice payments returned successfully' })
  findByInvoice(@Param('invoiceId') invoiceId: string, @CurrentTenant() companyId: string) {
    return this.paymentsService.findByInvoice(invoiceId, companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiParam({ name: 'id', description: 'Payment UUID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Payment returned successfully' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  findOne(@Param('id') id: string, @CurrentTenant() companyId: string) {
    return this.paymentsService.findOne(id, companyId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update payment' })
  @ApiParam({ name: 'id', description: 'Payment UUID' })
  @ApiBody({ 
    type: UpdatePaymentDto,
    examples: {
      update: {
        summary: 'Update Payment',
        value: {
          amount: 1100.00,
          referenceNumber: 'TXN987654321',
          notes: 'Updated payment amount'
        }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Payment updated successfully' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto, @CurrentTenant() companyId: string) {
    return this.paymentsService.update(id, updatePaymentDto, companyId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete payment' })
  @ApiParam({ name: 'id', description: 'Payment UUID' })
  @ApiResponse({ status: 200, description: 'Payment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  remove(@Param('id') id: string, @CurrentTenant() companyId: string) {
    return this.paymentsService.remove(id, companyId);
  }
}