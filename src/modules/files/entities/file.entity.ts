import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Company } from '../../companies/entities/company.entity';

export enum FileKind {
  LOGO = 'logo',
  INVOICE_PDF = 'invoice_pdf',
  RECEIPT = 'receipt'
}

@Entity('files')
export class File extends BaseEntity {
  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ type: 'enum', enum: FileKind })
  kind: FileKind;

  @Column({ type: 'text' })
  url: string;

  @Column({ type: 'bigint' })
  size: number;

  @Column({ length: 100 })
  mime: string;

  @Column({ name: 'linked_entity', type: 'jsonb', nullable: true })
  linkedEntity: object;

  @Column({ name: 'created_by', type: 'uuid' })
  createdBy: string;
}