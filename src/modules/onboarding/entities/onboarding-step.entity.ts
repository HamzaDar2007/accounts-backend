import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Company } from '../../companies/entities/company.entity';

export enum StepName {
  COMPANY_SETUP = 'company_setup',
  FIRST_CUSTOMER = 'first_customer',
  FIRST_ITEM = 'first_item',
  FIRST_INVOICE = 'first_invoice'
}

@Entity('onboarding_steps')
export class OnboardingStep extends BaseEntity {
  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'step_name', type: 'enum', enum: StepName })
  stepName: StepName;

  @Column({ name: 'is_completed', type: 'boolean', default: false })
  isCompleted: boolean;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date;
}