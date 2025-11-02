import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VatManagementService } from './vat-management.service';
import { VatManagementController } from './vat-management.controller';
import { VatSetting } from './entities/vat-setting.entity';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([VatSetting]), CommonModule],
  controllers: [VatManagementController],
  providers: [VatManagementService],
  exports: [VatManagementService],
})
export class VatManagementModule {}