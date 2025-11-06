import { IsString, IsUUID, IsOptional, IsObject, Length } from 'class-validator';

export class CreateAuditLogDto {
  @IsUUID()
  userId: string;

  @IsString()
  @Length(1, 100)
  action: string;

  @IsString()
  @Length(1, 100)
  entity: string;

  @IsUUID()
  entityId: string;

  @IsOptional()
  @IsObject()
  diff?: object;
}