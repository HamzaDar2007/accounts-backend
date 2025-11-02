import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { FaqService } from './faq.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/country.enum';

@ApiTags('FAQ')
@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Get('categories')
  @ApiOperation({ summary: 'Get FAQ categories (Public)' })
  @ApiResponse({ status: 200, description: 'FAQ categories returned successfully' })
  getCategories() {
    return this.faqService.getCategories();
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Get FAQs by category (Public)' })
  @ApiParam({ name: 'categoryId', description: 'Category ID' })
  @ApiResponse({ status: 200, description: 'FAQs returned successfully' })
  getFaqsByCategory(@Param('categoryId') categoryId: string) {
    return this.faqService.getFaqsByCategory(categoryId);
  }

  @Post('categories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create FAQ category (Owner only)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        titleEn: { type: 'string', example: 'Getting Started' },
        titleAr: { type: 'string', example: 'البدء' },
        sortOrder: { type: 'number', example: 1 }
      },
      required: ['titleEn']
    }
  })
  @ApiResponse({ status: 201, description: 'FAQ category created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Owner role required' })
  createCategory(@Body() body: any) {
    return this.faqService.createCategory(body);
  }

  @Post('faqs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create FAQ (Owner only)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        categoryId: { type: 'string' },
        questionEn: { type: 'string', example: 'How do I create an invoice?' },
        questionAr: { type: 'string', example: 'كيف أنشئ فاتورة؟' },
        answerEn: { type: 'string', example: 'To create an invoice...' },
        answerAr: { type: 'string', example: 'لإنشاء فاتورة...' }
      },
      required: ['categoryId', 'questionEn', 'answerEn']
    }
  })
  @ApiResponse({ status: 201, description: 'FAQ created successfully' })
  createFaq(@Body() body: any) {
    return this.faqService.createFaq(body);
  }
}