// import { PartialType } from '@nestjs/mapped-types';
import { CreateVatSettingDto } from './create-vat-setting.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Country } from '../../../common/enums/country.enum';

export class UpdateVatSettingDto {
  @ApiProperty({ description: 'Country for VAT setting', enum: Country, example: Country.UAE, required: false })
  country?: Country;
  
  @ApiProperty({ description: 'VAT rate percentage', example: 5, minimum: 0, maximum: 100, required: false })
  vatRate?: number;
  
  @ApiProperty({ description: 'Set as default VAT rate', example: true, required: false })
  isDefault?: boolean;
  
  @ApiProperty({ description: 'VAT setting description', example: 'Updated VAT rate', required: false })
  description?: string;
  
  @ApiProperty({ description: 'VAT setting description in Arabic', example: 'معدل ضريبة محدث', required: false })
  descriptionAr?: string;
}