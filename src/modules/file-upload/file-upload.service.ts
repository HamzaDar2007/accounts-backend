import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AwsService } from '../aws/aws.service';
import * as path from 'path';

@Injectable()
export class FileUploadService {
  constructor(
    private configService: ConfigService,
    private awsService: AwsService,
  ) {}

  async uploadCompanyLogo(file: Express.Multer.File, companyId: string) {
    this.validateFile(file);

    const fileExtension = path.extname(file.originalname);
    const fileName = `logos/${companyId}/logo-${Date.now()}${fileExtension}`;

    const uploadResult = await this.awsService.uploadFile(
      fileName,
      file.buffer,
      file.mimetype,
    );

    return {
      url: uploadResult.Location,
      key: uploadResult.Key,
      fileName: file.originalname,
      size: file.size,
    };
  }

  async uploadInvoiceAttachment(
    file: Express.Multer.File,
    companyId: string,
    invoiceId: string,
  ) {
    this.validateFile(file);

    const fileExtension = path.extname(file.originalname);
    const fileName = `invoices/${companyId}/${invoiceId}/attachment-${Date.now()}${fileExtension}`;

    const uploadResult = await this.awsService.uploadFile(
      fileName,
      file.buffer,
      file.mimetype,
    );

    return {
      url: uploadResult.Location,
      key: uploadResult.Key,
      fileName: file.originalname,
      size: file.size,
    };
  }

  private validateFile(file: Express.Multer.File) {
    const maxSize = this.configService.get<number>('MAX_FILE_SIZE') || 5242880; // 5MB
    const allowedTypes = this.configService
      .get<string>('ALLOWED_FILE_TYPES')
      ?.split(',') || [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/pdf',
    ];

    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds maximum allowed size');
    }

    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('File type not allowed');
    }
  }
}
