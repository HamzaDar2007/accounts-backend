import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('locales')
export class Locale {
  @PrimaryColumn({ length: 100 })
  key: string;

  @Column({ type: 'text' })
  ar: string;

  @Column({ type: 'text' })
  en: string;
}