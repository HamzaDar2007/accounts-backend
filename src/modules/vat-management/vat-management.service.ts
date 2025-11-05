import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VatSetting } from './entities/vat-setting.entity';
import { CreateVatSettingDto } from './dto/create-vat-setting.dto';
import { UpdateVatSettingDto } from './dto/update-vat-setting.dto';
import { Country } from '../../common/enums/country.enum';
import { CountryConfigService } from '../../common/services/country-config.service';

@Injectable()
export class VatManagementService {
  constructor(
    @InjectRepository(VatSetting)
    private vatSettingRepository: Repository<VatSetting>,
    private countryConfigService: CountryConfigService,
  ) {}

  async create(createVatSettingDto: CreateVatSettingDto, companyId: string) {
    // Check if setting already exists for this country
    const existing = await this.vatSettingRepository.findOne({
      where: { companyId, country: createVatSettingDto.country },
    });

    if (existing) {
      throw new ConflictException('VAT setting already exists for this country');
    }

    const vatSetting = this.vatSettingRepository.create({
      ...createVatSettingDto,
      companyId,
    });

    return this.vatSettingRepository.save(vatSetting);
  }

  async findAll(companyId: string) {
    return this.vatSettingRepository.find({
      where: { companyId },
      order: { isDefault: 'DESC', country: 'ASC' },
    });
  }

  async findByCountry(country: Country, companyId: string) {
    const vatSetting = await this.vatSettingRepository.findOne({
      where: { companyId, country, isActive: true },
    });

    if (!vatSetting) {
      // Return default country VAT rate if no custom setting
      const defaultRate = this.countryConfigService.getVatRate(country);
      return {
        country,
        vatRate: defaultRate,
        isDefault: true,
        description: `Default ${country} VAT rate`,
      };
    }

    return vatSetting;
  }

  async getDefaultVatRate(companyId: string) {
    const defaultSetting = await this.vatSettingRepository.findOne({
      where: { companyId, isDefault: true, isActive: true },
    });

    if (defaultSetting) {
      return defaultSetting.vatRate;
    }

    // Return UAE default if no custom default
    return 5.0;
  }

  async update(id: string, updateVatSettingDto: UpdateVatSettingDto, companyId: string) {
    const vatSetting = await this.vatSettingRepository.findOne({
      where: { id, companyId },
    });

    if (!vatSetting) {
      throw new NotFoundException('VAT setting not found');
    }

    Object.assign(vatSetting, updateVatSettingDto);
    return this.vatSettingRepository.save(vatSetting);
  }

  async setDefault(id: string, companyId: string) {
    // Remove default from all settings
    await this.vatSettingRepository.update(
      { companyId },
      { isDefault: false }
    );

    // Set new default
    const vatSetting = await this.vatSettingRepository.findOne({
      where: { id, companyId },
    });

    if (!vatSetting) {
      throw new NotFoundException('VAT setting not found');
    }

    vatSetting.isDefault = true;
    return this.vatSettingRepository.save(vatSetting);
  }

  async remove(id: string, companyId: string) {
    const vatSetting = await this.vatSettingRepository.findOne({
      where: { id, companyId },
    });

    if (!vatSetting) {
      throw new NotFoundException('VAT setting not found');
    }

    vatSetting.isActive = false;
    await this.vatSettingRepository.save(vatSetting);
    return { message: 'VAT setting deactivated successfully' };
  }

  async initializeDefaultSettings(companyId: string, country: Country) {
    const defaultRate = this.countryConfigService.getVatRate(country);
    
    const vatSetting = this.vatSettingRepository.create({
      companyId,
      country,
      vatRate: defaultRate,
      isDefault: true,
      description: `Default ${country} VAT rate`,
    });

    return this.vatSettingRepository.save(vatSetting);
  }
}