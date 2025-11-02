import { IsArray, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignPermissionsDto {
  @ApiProperty({ 
    description: 'Array of permission IDs to assign to role', 
    example: ['123e4567-e89b-12d3-a456-426614174000', '987fcdeb-51a2-43d1-9f12-123456789abc'],
    type: [String]
  })
  @IsArray()
  @IsUUID('4', { each: true })
  permissionIds: string[];
}