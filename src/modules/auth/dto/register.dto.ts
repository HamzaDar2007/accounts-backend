import { IsEmail, IsString, MinLength, IsEnum, IsOptional, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsTrnValid } from '../../../common/validators/trn.validator';
import { Country, UserRole, Language } from '../../../common/enums/country.enum';

export class RegisterDto {
  @ApiProperty({ description: 'Company name', example: 'Acme Corporation' })
  @IsString()
  @MinLength(2)
  companyName: string;

  @ApiProperty({ description: 'Company country', enum: Country, example: Country.UAE })
  @IsEnum(Country)
  country: Country;

  @ApiProperty({ description: 'Owner first name', example: 'John' })
  @IsString()
  @MinLength(2)
  firstName: string;

  @ApiProperty({ description: 'Owner last name', example: 'Doe' })
  @IsString()
  @MinLength(2)
  lastName: string;

  @ApiProperty({ description: 'Owner email address', example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password (min 8 chars, must contain uppercase, lowercase, number/special char)', example: 'SecurePass123!' })
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must contain uppercase, lowercase, number/special character'
  })
  password: string;

  @ApiProperty({ description: 'Tax Registration Number (optional)', example: '123456789012345', required: false })
  @IsOptional()
  @IsString()
  @IsTrnValid()
  trn?: string;

  @ApiProperty({ description: 'Phone number (optional)', example: '+971501234567', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Company address (optional)', example: '123 Business St, Dubai, UAE', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: 'Preferred language', enum: Language, example: Language.EN, required: false })
  @IsOptional()
  @IsEnum(Language)
  language?: Language = Language.EN;
}