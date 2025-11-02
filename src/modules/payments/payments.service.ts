import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { AccountingService } from '../accounting/accounting.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private accountingService: AccountingService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto, companyId: string, userId: string) {
    try {
      const payment = this.paymentRepository.create({
        companyId,
        invoiceId: createPaymentDto.invoiceId,
        amount: createPaymentDto.amount,
        paymentMethod: createPaymentDto.paymentMethod,
        referenceNumber: createPaymentDto.referenceNumber,
        notes: createPaymentDto.notes,
        paymentDate: new Date(createPaymentDto.paymentDate),
        createdBy: userId,
      });
      
      const savedPayment = await this.paymentRepository.save(payment);

      // Create journal entry for payment
      await this.accountingService.createPaymentJournalEntry(
        companyId,
        savedPayment.id,
        savedPayment.amount
      );

      return savedPayment;
    } catch (error) {
      throw new Error(`Failed to create payment: ${error.message}`);
    }
  }

  async findAll(companyId: string) {
    return this.paymentRepository.find({
      where: { companyId },
      relations: ['invoice'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, companyId: string) {
    const payment = await this.paymentRepository.findOne({
      where: { id, companyId },
      relations: ['invoice'],
    });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    return payment;
  }

  async findByInvoice(invoiceId: string, companyId: string) {
    return this.paymentRepository.find({
      where: { invoiceId, companyId },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto, companyId: string) {
    try {
      const payment = await this.findOne(id, companyId);
      
      // Safe property assignment
      if (updatePaymentDto.amount !== undefined) payment.amount = updatePaymentDto.amount;
      if (updatePaymentDto.paymentMethod !== undefined) payment.paymentMethod = updatePaymentDto.paymentMethod;
      if (updatePaymentDto.referenceNumber !== undefined) payment.referenceNumber = updatePaymentDto.referenceNumber;
      if (updatePaymentDto.notes !== undefined) payment.notes = updatePaymentDto.notes;
      if (updatePaymentDto.paymentDate !== undefined) payment.paymentDate = new Date(updatePaymentDto.paymentDate);
      
      return await this.paymentRepository.save(payment);
    } catch (error) {
      throw new Error(`Failed to update payment: ${error.message}`);
    }
  }

  async remove(id: string, companyId: string) {
    const payment = await this.findOne(id, companyId);
    await this.paymentRepository.remove(payment);
    return { message: 'Payment deleted successfully' };
  }
}