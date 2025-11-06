import { IsString, IsOptional, IsNumber, IsBoolean, Length } from 'class-validator';

export class CreateFaqCategoryDto {
  @IsString()
  @Length(1, 100)
  nameEn: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  nameAr?: string;

  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @IsOptional()
  @IsString()
  descriptionAr?: string;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}