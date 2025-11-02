import { IsString, IsEnum, IsOptional, IsBoolean, IsObject } from 'class-validator';
import { Language, Country } from '../../../common/enums/country.enum';
import { TemplateType } from '../entities/invoice-template.entity';

export class CreateTemplateDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  nameAr?: string;

  @IsEnum(TemplateType)
  type: TemplateType;

  @IsEnum(Language)
  language: Language;

  @IsOptional()
  @IsEnum(Country)
  country?: Country;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @IsObject()
  layout: Record<string, any>;

  @IsOptional()
  @IsObject()
  styles?: Record<string, any>;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  descriptionAr?: string;
}