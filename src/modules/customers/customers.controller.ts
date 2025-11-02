import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';

@ApiTags('Customers')
@ApiBearerAuth('JWT-auth')
@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @ApiOperation({ summary: 'Create customer' })
  @ApiBody({ 
    type: CreateCustomerDto,
    examples: {
      individual: {
        summary: 'Individual Customer',
        value: {
          nameEn: 'John Doe',
          nameAr: 'جون دو',
          customerType: 'individual',
          email: 'john@example.com',
          phone: '+971501234567',
          addressEn: '123 Main St, Dubai',
          addressAr: '123 الشارع الرئيسي، دبي',
          city: 'Dubai',
          country: 'UAE'
        }
      },
      business: {
        summary: 'Business Customer',
        value: {
          nameEn: 'ABC Company LLC',
          nameAr: 'شركة أي بي سي ذ.م.م',
          customerType: 'business',
          taxRegistrationNumber: '100000000000003',
          email: 'info@abc.com',
          phone: '+971501234567',
          addressEn: '456 Business Bay, Dubai',
          city: 'Dubai',
          country: 'UAE'
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Customer created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createCustomerDto: CreateCustomerDto, @CurrentTenant() companyId: string) {
    return this.customersService.create(createCustomerDto, companyId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({ status: 200, description: 'Customers list returned successfully' })
  findAll(@CurrentTenant() companyId: string) {
    return this.customersService.findAll(companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer by ID' })
  @ApiParam({ name: 'id', description: 'Customer UUID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Customer returned successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  findOne(@Param('id') id: string, @CurrentTenant() companyId: string) {
    return this.customersService.findOne(id, companyId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update customer' })
  @ApiParam({ name: 'id', description: 'Customer UUID' })
  @ApiBody({ 
    type: UpdateCustomerDto,
    examples: {
      update: {
        summary: 'Update Customer',
        value: {
          nameEn: 'John Smith',
          email: 'johnsmith@example.com',
          phone: '+971509876543'
        }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Customer updated successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto, @CurrentTenant() companyId: string) {
    return this.customersService.update(id, updateCustomerDto, companyId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate customer' })
  @ApiParam({ name: 'id', description: 'Customer UUID' })
  @ApiResponse({ status: 200, description: 'Customer deactivated successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  remove(@Param('id') id: string, @CurrentTenant() companyId: string) {
    return this.customersService.remove(id, companyId);
  }

  @Post(':id/validate-trn')
  @ApiOperation({ summary: 'Validate customer TRN' })
  @ApiParam({ name: 'id', description: 'Customer UUID' })
  @ApiResponse({ status: 200, description: 'TRN validation result', example: { valid: true, message: 'TRN is valid' } })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  validateTrn(@Param('id') id: string, @CurrentTenant() companyId: string) {
    return this.customersService.validateTrn(id, companyId);
  }
}