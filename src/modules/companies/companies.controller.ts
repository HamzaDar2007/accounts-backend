import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { UserRole } from '../../common/enums/country.enum';

@ApiTags('Companies')
@ApiBearerAuth('JWT-auth')
@Controller('companies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get('current')
  @ApiOperation({ summary: 'Get current company details' })
  @ApiResponse({ status: 200, description: 'Company details returned successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findCurrent(@CurrentTenant() companyId: string) {
    return this.companiesService.findCurrent(companyId);
  }

  @Patch('current')
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Update current company details (Owner only)' })
  @ApiBody({ 
    type: UpdateCompanyDto,
    examples: {
      update: {
        summary: 'Update Company',
        value: {
          nameEn: 'Al-Rashid Trading LLC - Updated',
          nameAr: 'شركة الراشد للتجارة ذ.م.م - محدث',
          addressEn: '456 New Business Bay, Dubai',
          phone: '+971501234999',
          email: 'info@alrashid.ae'
        }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Company updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Owner role required' })
  updateCurrent(
    @CurrentTenant() companyId: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companiesService.updateCurrent(companyId, updateCompanyDto);
  }

  @Get('settings')
  @ApiOperation({ summary: 'Get company settings' })
  @ApiResponse({ status: 200, description: 'Company settings returned successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getSettings(@CurrentTenant() companyId: string) {
    return this.companiesService.getSettings(companyId);
  }

  @Patch('settings')
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Update company settings (Owner only)' })
  @ApiBody({ 
    type: UpdateSettingsDto,
    examples: {
      settings: {
        summary: 'Update Settings',
        value: {
          invoicePrefix: 'INV',
          nextInvoiceNumber: 1001,
          defaultPaymentTerms: 45,
          enableWhatsappInvoicing: true,
          enablePayrollModule: false,
          enableCorporateTax: true
        }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Company settings updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Owner role required' })
  updateSettings(
    @CurrentTenant() companyId: string,
    @Body() updateSettingsDto: UpdateSettingsDto,
  ) {
    return this.companiesService.updateSettings(companyId, updateSettingsDto);
  }

  @Post('logo')
  @Roles(UserRole.OWNER)
  @UseInterceptors(FileInterceptor('logo'))
  @ApiOperation({ summary: 'Upload company logo (Owner only)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        logo: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Logo uploaded successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Owner role required' })
  uploadLogo(
    @CurrentTenant() companyId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // TODO: Implement S3 upload in Milestone 2
    const logoUrl = `https://example.com/logos/${file.filename}`;
    return this.companiesService.uploadLogo(companyId, logoUrl);
  }
}
