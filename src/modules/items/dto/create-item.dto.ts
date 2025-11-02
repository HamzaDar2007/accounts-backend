import { IsString, IsNumber, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { ItemType } from '../entities/item.entity';

export class CreateItemDto {
  @IsString()
  nameEn: string;

  @IsOptional()
  @IsString()
  nameAr?: string;

  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @IsOptional()
  @IsString()
  descriptionAr?: string;

  @IsEnum(ItemType)
  itemType: ItemType;

  @IsNumber()
  unitPrice: number;

  @IsOptional()
  @IsNumber()
  costPrice?: number;

  @IsOptional()
  @IsNumber()
  taxRate?: number;

  @IsOptional()
  @IsBoolean()
  isTaxable?: boolean;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsNumber()
  currentStock?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}