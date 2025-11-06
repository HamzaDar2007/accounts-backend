import { IsString, IsUUID, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateFaqDto {
  @IsUUID()
  categoryId: string;

  @IsString()
  questionEn: string;

  @IsOptional()
  @IsString()
  questionAr?: string;

  @IsString()
  answerEn: string;

  @IsOptional()
  @IsString()
  answerAr?: string;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}