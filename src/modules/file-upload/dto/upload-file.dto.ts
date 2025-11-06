import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum FileType {
  LOGO = 'logo',
  ATTACHMENT = 'attachment',
  DOCUMENT = 'document'
}

export class UploadFileDto {
  @IsEnum(FileType)
  fileType: FileType;

  @IsOptional()
  @IsString()
  entityId?: string;

  @IsOptional()
  @IsString()
  description?: string;
}