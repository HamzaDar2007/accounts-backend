import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ description: 'Role name', example: 'Manager' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Role description', example: 'Can manage invoices and customers', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}