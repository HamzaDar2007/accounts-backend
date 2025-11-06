import { IsString, IsEnum, IsOptional, IsBoolean, Length } from 'class-validator';
import { AccountType } from '../entities/account.entity';

export class CreateAccountDto {
  @IsString()
  @Length(1, 20)
  accountCode: string;

  @IsString()
  @Length(1, 255)
  accountNameEn: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  accountNameAr?: string;

  @IsEnum(AccountType)
  accountType: AccountType;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  accountSubtype?: string;

  @IsOptional()
  @IsString()
  parentAccountId?: string;

  @IsOptional()
  @IsBoolean()
  isSystemAccount?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}