import { Module } from '@nestjs/common';
import { CountryConfigService } from './services/country-config.service';

@Module({
  providers: [CountryConfigService],
  exports: [CountryConfigService],
})
export class CommonModule {}