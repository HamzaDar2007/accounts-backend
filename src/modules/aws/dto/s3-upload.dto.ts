import { IsString, IsOptional } from 'class-validator';

export class S3UploadDto {
  @IsString()
  fileName: string;

  @IsString()
  contentType: string;

  @IsOptional()
  @IsString()
  folder?: string;

  @IsOptional()
  @IsString()
  acl?: string;
}