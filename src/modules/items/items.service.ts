import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
  ) {}

  async create(createItemDto: CreateItemDto, companyId: string) {
    const item = this.itemRepository.create({
      ...createItemDto,
      companyId,
    });
    return this.itemRepository.save(item);
  }

  async findAll(companyId: string) {
    return this.itemRepository.find({
      where: { companyId, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, companyId: string) {
    const item = await this.itemRepository.findOne({
      where: { id, companyId },
    });
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    return item;
  }

  async update(id: string, updateItemDto: UpdateItemDto, companyId: string) {
    const item = await this.findOne(id, companyId);
    Object.assign(item, updateItemDto);
    return this.itemRepository.save(item);
  }

  async remove(id: string, companyId: string) {
    const item = await this.findOne(id, companyId);
    item.isActive = false;
    await this.itemRepository.save(item);
    return { message: 'Item deactivated successfully' };
  }

  async getCategories(companyId: string) {
    const result = await this.itemRepository
      .createQueryBuilder('item')
      .select('DISTINCT item.category', 'category')
      .where('item.companyId = :companyId', { companyId })
      .andWhere('item.category IS NOT NULL')
      .getRawMany();
    
    return result.map(r => r.category);
  }

  async aiSuggest(query: string) {
    // TODO: Implement AI-powered item name suggestions
    const suggestions = [
      `${query} - Standard`,
      `${query} - Premium`,
      `${query} - Basic`,
    ];
    return { suggestions };
  }
}