import { IsBoolean, IsOptional, IsDateString } from 'class-validator';

export class UpdateOnboardingStepDto {
  @IsBoolean()
  isCompleted: boolean;

  @IsOptional()
  @IsDateString()
  completedAt?: Date;
}