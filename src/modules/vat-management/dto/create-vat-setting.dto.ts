import { IsEnum, IsNumber, IsBoolean, IsOptional, IsString, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Country } from '../../../common/enums/country.enum';

export class CreateVatSettingDto {
  @ApiProperty({ description: 'Country for VAT setting', enum: Country, example: Country.UAE })
  @IsEnum(Country)
  country: Country;

  @ApiProperty({ description: 'VAT rate percentage', example: 5, minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  vatRate: number;

  @ApiProperty({ description: 'Set as default VAT rate', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiProperty({ description: 'VAT setting description', example: 'Standard VAT rate', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'VAT setting description in Arabic', example: 'معدل ضريبة القيمة المضافة القياسي', required: false })
  @IsOptional()
  @IsString()
  descriptionAr?: string;
}