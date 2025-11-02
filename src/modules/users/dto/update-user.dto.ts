import { IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole, Language } from '../../../common/enums/country.enum';

export class UpdateUserDto {
  @ApiProperty({ description: 'First name', example: 'Jane', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ description: 'Last name', example: 'Smith', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ description: 'User role', enum: UserRole, example: UserRole.STAFF, required: false })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty({ description: 'Preferred language', enum: Language, example: Language.EN, required: false })
  @IsOptional()
  @IsEnum(Language)
  preferredLanguage?: Language;

  @ApiProperty({ description: 'User active status', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'Phone number', example: '+971501234567', required: false })
  @IsOptional()
  @IsString()
  phone?: string;
}