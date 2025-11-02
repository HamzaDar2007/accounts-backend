import { Controller, Get, Post, Body, Patch, Param, UseGuards, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { InvoiceTemplatesService } from './invoice-templates.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { UserRole, Language, Country } from '../../common/enums/country.enum';
import { TemplateType } from './entities/invoice-template.entity';

@ApiTags('Invoice Templates')
@ApiBearerAuth('JWT-auth')
@Controller('invoice-templates')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InvoiceTemplatesController {
  constructor(private readonly templatesService: InvoiceTemplatesService) {}

  @Post()
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Create invoice template (Owner only)' })
  @ApiBody({ type: CreateTemplateDto })
  @ApiResponse({ status: 201, description: 'Template created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Owner role required' })
  create(@Body() createTemplateDto: CreateTemplateDto, @CurrentTenant() companyId: string) {
    return this.templatesService.create(createTemplateDto, companyId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all invoice templates' })
  @ApiResponse({ status: 200, description: 'Templates list returned successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@CurrentTenant() companyId: string) {
    return this.templatesService.findAll(companyId);
  }

  @Get('default')
  @ApiOperation({ summary: 'Get default invoice template' })
  @ApiQuery({ name: 'language', enum: Language, required: false, description: 'Template language' })
  @ApiQuery({ name: 'country', enum: Country, description: 'Country for template' })
  @ApiResponse({ status: 200, description: 'Default template returned successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getDefaultTemplate(
    @Query('language') language: Language = Language.EN,
    @Query('country') country: Country,
    @CurrentTenant() companyId: string,
  ) {
    return this.templatesService.getDefaultTemplate(language, country, companyId);
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get templates by type' })
  @ApiParam({ name: 'type', enum: TemplateType, description: 'Template type' })
  @ApiQuery({ name: 'language', enum: Language, required: false, description: 'Template language' })
  @ApiResponse({ status: 200, description: 'Templates by type returned successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findByType(
    @Param('type') type: TemplateType,
    @Query('language') language: Language = Language.EN,
    @CurrentTenant() companyId: string,
  ) {
    return this.templatesService.findByType(type, language, companyId);
  }

  @Patch(':id/set-default')
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Set template as default (Owner only)' })
  @ApiParam({ name: 'id', description: 'Template ID' })
  @ApiResponse({ status: 200, description: 'Template set as default successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Owner role required' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  setDefault(@Param('id') id: string, @CurrentTenant() companyId: string) {
    return this.templatesService.setDefault(id, companyId);
  }

  @Post('initialize-system')
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Initialize system templates (Owner only)' })
  @ApiResponse({ status: 200, description: 'System templates initialized successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Owner role required' })
  initializeSystemTemplates() {
    return this.templatesService.initializeSystemTemplates();
  }

  @Get(':id/render')
  @ApiOperation({ summary: 'Render template with invoice data' })
  @ApiParam({ name: 'id', description: 'Template ID' })
  @ApiBody({ description: 'Invoice data for template rendering' })
  @ApiResponse({ status: 200, description: 'Template rendered successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  renderTemplate(@Param('id') id: string, @Body() invoiceData: any) {
    return this.templatesService.renderTemplate(id, invoiceData);
  }
}