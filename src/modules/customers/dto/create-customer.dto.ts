import { IsString, IsEmail, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { CustomerType } from '../entities/customer.entity';
import { Country } from '../../../common/enums/country.enum';

export class CreateCustomerDto {
  @IsString()
  nameEn: string;

  @IsOptional()
  @IsString()
  nameAr?: string;

  @IsEnum(CustomerType)
  customerType: CustomerType;

  @IsOptional()
  @IsString()
  taxRegistrationNumber?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  addressEn?: string;

  @IsOptional()
  @IsString()
  addressAr?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsEnum(Country)
  country?: Country;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}