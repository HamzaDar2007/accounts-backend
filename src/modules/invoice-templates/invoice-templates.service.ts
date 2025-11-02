import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvoiceTemplate, TemplateType } from './entities/invoice-template.entity';
import { CreateTemplateDto } from './dto/create-template.dto';
import { Language, Country } from '../../common/enums/country.enum';
import { FTA_COMPLIANT_TEMPLATE_EN, FTA_COMPLIANT_TEMPLATE_AR } from './templates/fta-compliant.template';

@Injectable()
export class InvoiceTemplatesService {
  constructor(
    @InjectRepository(InvoiceTemplate)
    private templateRepository: Repository<InvoiceTemplate>,
  ) {}

  async create(createTemplateDto: CreateTemplateDto, companyId: string) {
    const template = this.templateRepository.create({
      ...createTemplateDto,
      companyId,
    });

    return this.templateRepository.save(template);
  }

  async findAll(companyId: string) {
    return this.templateRepository.find({
      where: [
        { companyId, isActive: true },
        { isSystemTemplate: true, isActive: true }
      ],
      order: { isDefault: 'DESC', isSystemTemplate: 'DESC', name: 'ASC' },
    });
  }

  async findByType(type: TemplateType, language: Language, companyId?: string) {
    const where: any = { type, language, isActive: true };
    if (companyId) {
      where.companyId = companyId;
    }

    return this.templateRepository.findOne({ where });
  }

  async getDefaultTemplate(language: Language, country: Country, companyId: string) {
    // Try to find company-specific default template
    let template = await this.templateRepository.findOne({
      where: { companyId, language, isDefault: true, isActive: true },
    });

    if (!template) {
      // Try to find system FTA-compliant template
      template = await this.templateRepository.findOne({
        where: { 
          type: TemplateType.FTA_COMPLIANT, 
          language, 
          country,
          isSystemTemplate: true, 
          isActive: true 
        },
      });
    }

    if (!template) {
      // Create default FTA-compliant template
      template = await this.createSystemTemplate(language, country);
    }

    return template;
  }

  async setDefault(id: string, companyId: string) {
    // Remove default from all company templates
    await this.templateRepository.update(
      { companyId },
      { isDefault: false }
    );

    // Set new default
    const template = await this.templateRepository.findOne({
      where: { id, companyId },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    template.isDefault = true;
    return this.templateRepository.save(template);
  }

  async initializeSystemTemplates() {
    // Create FTA-compliant templates for all countries and languages
    const countries = [Country.UAE, Country.KSA, Country.EGYPT];
    const languages = [Language.EN, Language.AR];

    for (const country of countries) {
      for (const language of languages) {
        const existing = await this.templateRepository.findOne({
          where: {
            type: TemplateType.FTA_COMPLIANT,
            language,
            country,
            isSystemTemplate: true,
          },
        });

        if (!existing) {
          await this.createSystemTemplate(language, country);
        }
      }
    }
  }

  private async createSystemTemplate(language: Language, country: Country) {
    const layout = language === Language.AR ? 
      FTA_COMPLIANT_TEMPLATE_AR : 
      FTA_COMPLIANT_TEMPLATE_EN;

    const template = this.templateRepository.create({
      name: `FTA Compliant ${country} (${language.toUpperCase()})`,
      nameAr: language === Language.AR ? `قالب متوافق مع الهيئة ${country}` : undefined,
      type: TemplateType.FTA_COMPLIANT,
      language,
      country,
      isSystemTemplate: true,
      isDefault: true,
      layout,
      description: `FTA-compliant tax invoice template for ${country}`,
      descriptionAr: language === Language.AR ? `قالب فاتورة ضريبية متوافق مع الهيئة لدولة ${country}` : undefined,
    });

    return this.templateRepository.save(template);
  }

  async renderTemplate(templateId: string, invoiceData: any) {
    const template = await this.templateRepository.findOne({
      where: { id: templateId },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    return {
      template: template.layout,
      styles: template.styles,
      data: invoiceData,
      compliance: {
        ftaCompliant: template.type === TemplateType.FTA_COMPLIANT,
        zatcaCompliant: template.type === TemplateType.ZATCA_COMPLIANT,
      }
    };
  }
}