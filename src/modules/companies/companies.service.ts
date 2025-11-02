import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { CompanySettings } from './entities/company-settings.entity';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { AccountingService } from '../accounting/accounting.service';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(CompanySettings)
    private companySettingsRepository: Repository<CompanySettings>,
    private accountingService: AccountingService,
  ) {}

  async findCurrent(companyId: string) {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
      relations: ['settings'],
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    // Initialize accounting if not done
    await this.accountingService.initializeCompanyAccounting(companyId);

    return company;
  }

  async updateCurrent(companyId: string, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    Object.assign(company, updateCompanyDto);
    return this.companyRepository.save(company);
  }

  async getSettings(companyId: string) {
    const settings = await this.companySettingsRepository.findOne({
      where: { companyId },
    });

    if (!settings) {
      throw new NotFoundException('Company settings not found');
    }

    return settings;
  }

  async updateSettings(
    companyId: string,
    updateSettingsDto: UpdateSettingsDto,
  ) {
    const settings = await this.companySettingsRepository.findOne({
      where: { companyId },
    });

    if (!settings) {
      throw new NotFoundException('Company settings not found');
    }

    Object.assign(settings, updateSettingsDto);
    return this.companySettingsRepository.save(settings);
  }

  async uploadLogo(companyId: string, logoUrl: string) {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    company.logoUrl = logoUrl;
    return this.companyRepository.save(company);
  }
}
