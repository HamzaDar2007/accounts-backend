import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileUploadService } from './file-upload.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { UserRole } from '../../common/enums/country.enum';

@ApiTags('File Upload')
@ApiBearerAuth('JWT-auth')
@Controller('file-upload')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('company-logo')
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
  uploadCompanyLogo(
    @UploadedFile() file: Express.Multer.File,
    @CurrentTenant() companyId: string,
  ) {
    return this.fileUploadService.uploadCompanyLogo(file, companyId);
  }

  @Post('invoice/:invoiceId/attachment')
  @UseInterceptors(FileInterceptor('attachment'))
  @ApiOperation({ summary: 'Upload invoice attachment' })
  @ApiParam({ name: 'invoiceId', description: 'Invoice ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        attachment: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Attachment uploaded successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  uploadInvoiceAttachment(
    @UploadedFile() file: Express.Multer.File,
    @Param('invoiceId') invoiceId: string,
    @CurrentTenant() companyId: string,
  ) {
    return this.fileUploadService.uploadInvoiceAttachment(
      file,
      companyId,
      invoiceId,
    );
  }
}
