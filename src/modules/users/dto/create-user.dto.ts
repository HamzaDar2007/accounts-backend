import { IsEmail, IsString, MinLength, IsEnum, IsOptional, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole, Language } from '../../../common/enums/country.enum';

export class CreateUserDto {
  @ApiProperty({ description: 'User email address', example: 'staff@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password (min 8 chars, must contain uppercase, lowercase, number/special char)', example: 'StaffPass123!' })
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must contain uppercase, lowercase, number/special character'
  })
  password: string;

  @ApiProperty({ description: 'User role', enum: UserRole, example: UserRole.STAFF })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ description: 'First name', example: 'Jane' })
  @IsString()
  @MinLength(2)
  firstName: string;

  @ApiProperty({ description: 'Last name', example: 'Smith' })
  @IsString()
  @MinLength(2)
  lastName: string;

  @ApiProperty({ description: 'Preferred language', enum: Language, example: Language.EN, required: false })
  @IsOptional()
  @IsEnum(Language)
  preferredLanguage?: Language = Language.EN;

  @ApiProperty({ description: 'Phone number (optional)', example: '+971501234567', required: false })
  @IsOptional()
  @IsString()
  phone?: string;
}