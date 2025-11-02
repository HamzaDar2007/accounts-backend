import { Module } from '@nestjs/common';
import { PdfGenerationService } from './pdf-generation.service';
import { PdfGenerationController } from './pdf-generation.controller';
import { InvoicesModule } from '../invoices/invoices.module';

@Module({
  imports: [InvoicesModule],
  controllers: [PdfGenerationController],
  providers: [PdfGenerationService],
  exports: [PdfGenerationService],
})
export class PdfGenerationModule {}