import { IsEnum, IsOptional } from 'class-validator';
import { BackupType } from '../entities/backup-log.entity';

export class CreateBackupDto {
  @IsEnum(BackupType)
  backupType: BackupType;

  @IsOptional()
  companyId?: string;
}