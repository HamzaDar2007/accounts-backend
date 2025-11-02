import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { VatManagementService } from './vat-management.service';
import { CreateVatSettingDto } from './dto/create-vat-setting.dto';
import { UpdateVatSettingDto } from './dto/update-vat-setting.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { UserRole, Country } from '../../common/enums/country.enum';

@ApiTags('VAT Management')
@ApiBearerAuth('JWT-auth')
@Controller('vat-management')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VatManagementController {
  constructor(private readonly vatManagementService: VatManagementService) {}

  @Post()
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Create VAT setting (Owner only)' })
  @ApiBody({ type: CreateVatSettingDto })
  @ApiResponse({ status: 201, description: 'VAT setting created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Owner role required' })
  create(@Body() createVatSettingDto: CreateVatSettingDto, @CurrentTenant() companyId: string) {
    return this.vatManagementService.create(createVatSettingDto, companyId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all VAT settings' })
  @ApiResponse({ status: 200, description: 'VAT settings list returned successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@CurrentTenant() companyId: string) {
    return this.vatManagementService.findAll(companyId);
  }

  @Get('country/:country')
  @ApiOperation({ summary: 'Get VAT settings by country' })
  @ApiParam({ name: 'country', enum: Country, description: 'Country code' })
  @ApiResponse({ status: 200, description: 'VAT settings for country returned successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findByCountry(@Param('country') country: Country, @CurrentTenant() companyId: string) {
    return this.vatManagementService.findByCountry(country, companyId);
  }

  @Get('default-rate')
  @ApiOperation({ summary: 'Get default VAT rate' })
  @ApiResponse({ status: 200, description: 'Default VAT rate returned successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getDefaultRate(@CurrentTenant() companyId: string) {
    return this.vatManagementService.getDefaultVatRate(companyId);
  }

  @Patch(':id')
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Update VAT setting (Owner only)' })
  @ApiParam({ name: 'id', description: 'VAT setting ID' })
  @ApiBody({ type: UpdateVatSettingDto })
  @ApiResponse({ status: 200, description: 'VAT setting updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Owner role required' })
  @ApiResponse({ status: 404, description: 'VAT setting not found' })
  update(
    @Param('id') id: string,
    @Body() updateVatSettingDto: UpdateVatSettingDto,
    @CurrentTenant() companyId: string,
  ) {
    return this.vatManagementService.update(id, updateVatSettingDto, companyId);
  }

  @Patch(':id/set-default')
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Set VAT setting as default (Owner only)' })
  @ApiParam({ name: 'id', description: 'VAT setting ID' })
  @ApiResponse({ status: 200, description: 'VAT setting set as default successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Owner role required' })
  @ApiResponse({ status: 404, description: 'VAT setting not found' })
  setDefault(@Param('id') id: string, @CurrentTenant() companyId: string) {
    return this.vatManagementService.setDefault(id, companyId);
  }

  @Delete(':id')
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Delete VAT setting (Owner only)' })
  @ApiParam({ name: 'id', description: 'VAT setting ID' })
  @ApiResponse({ status: 200, description: 'VAT setting deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Owner role required' })
  @ApiResponse({ status: 404, description: 'VAT setting not found' })
  remove(@Param('id') id: string, @CurrentTenant() companyId: string) {
    return this.vatManagementService.remove(id, companyId);
  }
}