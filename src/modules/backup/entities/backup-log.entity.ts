import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Company } from '../../companies/entities/company.entity';

export enum BackupType {
  AUTOMATIC = 'automatic',
  MANUAL = 'manual'
}

export enum BackupStatus {
  SUCCESS = 'success',
  FAILED = 'failed'
}

@Entity('backup_logs')
export class BackupLog extends BaseEntity {
  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'backup_type', type: 'enum', enum: BackupType })
  backupType: BackupType;

  @Column({ name: 'backup_location', type: 'text' })
  backupLocation: string;

  @Column({ name: 'backup_size', type: 'bigint', nullable: true })
  backupSize: number;

  @Column({ type: 'enum', enum: BackupStatus })
  status: BackupStatus;
}