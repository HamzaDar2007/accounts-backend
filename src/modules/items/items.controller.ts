import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';

@ApiTags('Items')
@ApiBearerAuth('JWT-auth')
@Controller('items')
@UseGuards(JwtAuthGuard)
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @ApiOperation({ summary: 'Create item' })
  @ApiBody({ 
    type: CreateItemDto,
    examples: {
      product: {
        summary: 'Product Item',
        value: {
          nameEn: 'Laptop Computer',
          nameAr: 'حاسوب محمول',
          descriptionEn: 'High-performance laptop',
          descriptionAr: 'حاسوب محمول عالي الأداء',
          itemType: 'product',
          unitPrice: 2500.00,
          costPrice: 2000.00,
          taxRate: 5.0,
          isTaxable: true,
          category: 'Electronics',
          sku: 'LAP001',
          currentStock: 10
        }
      },
      service: {
        summary: 'Service Item',
        value: {
          nameEn: 'IT Consultation',
          nameAr: 'استشارات تقنية',
          descriptionEn: 'Professional IT consulting services',
          itemType: 'service',
          unitPrice: 500.00,
          taxRate: 5.0,
          isTaxable: true,
          category: 'Consulting'
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Item created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body() createItemDto: CreateItemDto, @CurrentTenant() companyId: string) {
    return this.itemsService.create(createItemDto, companyId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all items' })
  @ApiResponse({ status: 200, description: 'Items list returned successfully' })
  findAll(@CurrentTenant() companyId: string) {
    return this.itemsService.findAll(companyId);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get item categories' })
  @ApiResponse({ status: 200, description: 'Categories returned successfully' })
  getCategories(@CurrentTenant() companyId: string) {
    return this.itemsService.getCategories(companyId);
  }

  @Post('ai-suggest')
  @ApiOperation({ summary: 'AI item name suggestions' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        query: { type: 'string', example: 'laptop' }
      },
      required: ['query']
    },
    examples: {
      suggestion: {
        summary: 'Get AI Suggestions',
        value: { query: 'laptop computer' }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Suggestions returned successfully',
    example: {
      suggestions: ['laptop computer - Standard', 'laptop computer - Premium', 'laptop computer - Basic']
    }
  })
  aiSuggest(@Body() body: { query: string }) {
    return this.itemsService.aiSuggest(body.query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get item by ID' })
  @ApiParam({ name: 'id', description: 'Item UUID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Item returned successfully' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  findOne(@Param('id') id: string, @CurrentTenant() companyId: string) {
    return this.itemsService.findOne(id, companyId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update item' })
  @ApiParam({ name: 'id', description: 'Item UUID' })
  @ApiBody({ 
    type: UpdateItemDto,
    examples: {
      update: {
        summary: 'Update Item',
        value: {
          unitPrice: 2800.00,
          currentStock: 15,
          category: 'Electronics - Updated'
        }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Item updated successfully' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto, @CurrentTenant() companyId: string) {
    return this.itemsService.update(id, updateItemDto, companyId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate item' })
  @ApiParam({ name: 'id', description: 'Item UUID' })
  @ApiResponse({ status: 200, description: 'Item deactivated successfully' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  remove(@Param('id') id: string, @CurrentTenant() companyId: string) {
    return this.itemsService.remove(id, companyId);
  }
}