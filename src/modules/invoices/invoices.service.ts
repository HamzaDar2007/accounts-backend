import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { InvoiceItem } from './entities/invoice-item.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { AccountingService } from '../accounting/accounting.service';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @InjectRepository(InvoiceItem)
    private invoiceItemRepository: Repository<InvoiceItem>,
    private accountingService: AccountingService,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto, companyId: string, userId: string) {
    // Generate invoice number
    const invoiceNumber = await this.generateInvoiceNumber(companyId);
    
    // Calculate totals
    const { subtotal, taxTotal, total } = this.calculateTotals(createInvoiceDto);

    const invoice = this.invoiceRepository.create({
      companyId,
      invoiceNumber: invoiceNumber,
      customerId: createInvoiceDto.customerId,
      issueDate: new Date(createInvoiceDto.issueDate),
      dueDate: new Date(createInvoiceDto.dueDate),
      supplyDate: new Date(createInvoiceDto.issueDate),
      currency: createInvoiceDto.currency,
      subtotalAmount: subtotal,
      taxAmount: taxTotal,
      totalAmount: total,
      totalAmountAed: total,
      discountAmount: createInvoiceDto.discountTotal || 0,
      notesEn: createInvoiceDto.notesEn,
      notesAr: createInvoiceDto.notesAr,
      createdBy: userId,
    });

    const savedInvoice = await this.invoiceRepository.save(invoice);

    // Create invoice items
    const items = createInvoiceDto.lines.map(line => {
      const lineSubtotal = line.quantity * line.unitPrice - (line.discountAmount || 0);
      const taxAmount = lineSubtotal * (line.taxRatePercent / 100);
      const lineTotal = lineSubtotal + taxAmount;

      return this.invoiceItemRepository.create({
        invoiceId: savedInvoice.id,
        itemId: line.itemId,
        descriptionEn: line.descriptionEn,
        descriptionAr: line.descriptionAr,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        discountAmount: line.discountAmount || 0,
        taxRate: line.taxRatePercent,
        taxAmount,
        lineTotal,
      });
    });

    await this.invoiceItemRepository.save(items);

    // Create journal entry for invoice (if not draft)
    if (savedInvoice.status !== 'draft') {
      await this.accountingService.createInvoiceJournalEntry(
        companyId,
        savedInvoice.id,
        subtotal,
        taxTotal
      );
    }

    return this.findOne(savedInvoice.id, companyId);
  }

  async findAll(companyId: string) {
    return this.invoiceRepository.find({
      where: { companyId },
      relations: ['customer', 'items'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, companyId: string) {
    try {
      const invoice = await this.invoiceRepository.findOne({
        where: { id, companyId },
        relations: ['customer', 'items', 'items.item'],
      });

      if (!invoice) {
        throw new NotFoundException('Invoice not found');
      }

      return invoice;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to find invoice: ${error.message}`);
    }
  }

  async update(id: string, updateInvoiceDto: UpdateInvoiceDto, companyId: string, userId: string) {
    try {
      const invoice = await this.findOne(id, companyId);
      
      // Safe property assignment
      if (updateInvoiceDto.customerId !== undefined) invoice.customerId = updateInvoiceDto.customerId;
      if (updateInvoiceDto.invoiceDate !== undefined) invoice.issueDate = new Date(updateInvoiceDto.invoiceDate);
      if (updateInvoiceDto.dueDate !== undefined) invoice.dueDate = new Date(updateInvoiceDto.dueDate);
      if (updateInvoiceDto.notesEn !== undefined) invoice.notesEn = updateInvoiceDto.notesEn;
      if (updateInvoiceDto.notesAr !== undefined) invoice.notesAr = updateInvoiceDto.notesAr;
      if (updateInvoiceDto.discountAmount !== undefined) invoice.discountAmount = updateInvoiceDto.discountAmount;
      if (updateInvoiceDto.paymentMethod !== undefined) invoice.paymentMethod = updateInvoiceDto.paymentMethod;
      
      await this.invoiceRepository.save(invoice);
      return this.findOne(id, companyId);
    } catch (error) {
      throw new Error(`Failed to update invoice: ${error.message}`);
    }
  }

  async remove(id: string, companyId: string) {
    try {
      const invoice = await this.findOne(id, companyId);
      await this.invoiceRepository.remove(invoice);
      return { message: 'Invoice deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete invoice: ${error.message}`);
    }
  }

  private async generateInvoiceNumber(companyId: string): Promise<string> {
    const count = await this.invoiceRepository.count({ where: { companyId } });
    return `INV-${String(count + 1).padStart(4, '0')}`;
  }

  async markAsSent(id: string, companyId: string) {
    const invoice = await this.findOne(id, companyId);
    const wasDraft = invoice.status === 'draft';
    
    invoice.status = 'sent' as any;
    invoice.sentAt = new Date();
    await this.invoiceRepository.save(invoice);
    
    // Create journal entry if it was draft
    if (wasDraft) {
      await this.accountingService.createInvoiceJournalEntry(
        companyId,
        invoice.id,
        invoice.subtotalAmount,
        invoice.taxAmount
      );
    }
    
    return { message: 'Invoice marked as sent' };
  }

  async markAsPaid(id: string, companyId: string) {
    const invoice = await this.findOne(id, companyId);
    invoice.status = 'paid' as any;
    invoice.paidAt = new Date();
    await this.invoiceRepository.save(invoice);
    return { message: 'Invoice marked as paid' };
  }

  async generatePdf(id: string, companyId: string, lang: 'en' | 'ar') {
    const invoice = await this.findOne(id, companyId);
    // TODO: Integrate with PDF service
    return { pdfUrl: `${invoice.invoiceNumber}-${lang}.pdf` };
  }

  async duplicate(id: string, companyId: string, userId: string) {
    const original = await this.findOne(id, companyId);
    const newInvoiceNumber = await this.generateInvoiceNumber(companyId);
    
    const duplicate = this.invoiceRepository.create({
      companyId: original.companyId,
      customerId: original.customerId,
      invoiceNumber: newInvoiceNumber,
      invoiceType: original.invoiceType,
      status: 'draft' as any,
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      supplyDate: new Date(),
      subtotalAmount: original.subtotalAmount,
      taxAmount: original.taxAmount,
      discountAmount: original.discountAmount,
      totalAmount: original.totalAmount,
      currency: original.currency,
      exchangeRate: original.exchangeRate,
      totalAmountAed: original.totalAmountAed,
      paymentMethod: original.paymentMethod,
      notesEn: original.notesEn,
      notesAr: original.notesAr,
      paymentTerms: original.paymentTerms,
      createdBy: userId,
    });
    
    return this.invoiceRepository.save(duplicate);
  }

  async getNextNumber(companyId: string) {
    const nextNumber = await this.generateInvoiceNumber(companyId);
    return { nextNumber };
  }

  async getStats(companyId: string) {
    const stats = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .select('invoice.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('invoice.companyId = :companyId', { companyId })
      .groupBy('invoice.status')
      .getRawMany();
    
    return stats.reduce((acc, stat) => {
      acc[stat.status] = parseInt(stat.count);
      return acc;
    }, {});
  }

  async validateCompliance(id: string, companyId: string) {
    const invoice = await this.findOne(id, companyId);
    // TODO: Implement UAE/KSA compliance validation
    return { valid: true, message: 'Compliance validation not implemented yet' };
  }

  private calculateTotals(invoiceDto: CreateInvoiceDto) {
    let subtotal = 0;
    let taxTotal = 0;

    invoiceDto.lines.forEach(line => {
      const lineSubtotal = line.quantity * line.unitPrice - (line.discountAmount || 0);
      const taxAmount = lineSubtotal * (line.taxRatePercent / 100);
      
      subtotal += lineSubtotal;
      taxTotal += taxAmount;
    });

    const total = subtotal + taxTotal - (invoiceDto.discountTotal || 0);

    return { subtotal, taxTotal, total };
  }
}