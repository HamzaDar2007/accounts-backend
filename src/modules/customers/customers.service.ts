import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto, companyId: string) {
    const customer = this.customerRepository.create({
      ...createCustomerDto,
      companyId,
    });
    return this.customerRepository.save(customer);
  }

  async findAll(companyId: string) {
    return this.customerRepository.find({
      where: { companyId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, companyId: string) {
    const customer = await this.customerRepository.findOne({
      where: { id, companyId },
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto, companyId: string) {
    const customer = await this.findOne(id, companyId);
    Object.assign(customer, updateCustomerDto);
    return this.customerRepository.save(customer);
  }

  async remove(id: string, companyId: string) {
    const customer = await this.findOne(id, companyId);
    customer.isActive = false;
    await this.customerRepository.save(customer);
    return { message: 'Customer deactivated successfully' };
  }

  async validateTrn(id: string, companyId: string) {
    const customer = await this.findOne(id, companyId);
    // TODO: Implement TRN validation with FTA API
    return { valid: true, message: 'TRN validation not implemented yet' };
  }
}