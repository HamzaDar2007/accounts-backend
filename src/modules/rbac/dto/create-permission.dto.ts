import { IsString, IsOptional, Length } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsString()
  @Length(1, 100)
  slug: string;

  @IsString()
  @Length(1, 50)
  resource: string;

  @IsString()
  @Length(1, 20)
  action: string;

  @IsOptional()
  @IsString()
  description?: string;
}