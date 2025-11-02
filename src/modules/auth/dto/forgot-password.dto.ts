import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({ description: 'Email address for password reset', example: 'john.doe@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}