import { IsString, IsOptional, IsEmail, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCompanyDto {
  @ApiProperty({ description: 'Company name', example: 'Acme Corporation Ltd', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Company name in English', example: 'Acme Corporation Ltd', required: false })
  @IsOptional()
  @IsString()
  nameEn?: string;

  @ApiProperty({ description: 'Company name in Arabic', example: 'شركة أكمي المحدودة', required: false })
  @IsOptional()
  @IsString()
  nameAr?: string;

  @ApiProperty({ description: 'Tax Registration Number', example: '123456789012345', required: false })
  @IsOptional()
  @IsString()
  taxRegistrationNumber?: string;

  @ApiProperty({ description: 'Company address', example: '123 Business St, Dubai, UAE', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: 'Company address in English', example: '123 Business St, Dubai, UAE', required: false })
  @IsOptional()
  @IsString()
  addressEn?: string;

  @ApiProperty({ description: 'Company address in Arabic', example: '123 شارع الأعمال، دبي، الإمارات', required: false })
  @IsOptional()
  @IsString()
  addressAr?: string;

  @ApiProperty({ description: 'Company phone number', example: '+971501234567', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Company email address', example: 'info@acme.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Company website URL', example: 'https://www.acme.com', required: false })
  @IsOptional()
  @IsUrl()
  website?: string;
}