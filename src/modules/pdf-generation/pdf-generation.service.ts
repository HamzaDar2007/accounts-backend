import { Injectable } from '@nestjs/common';
import { Invoice } from '../invoices/entities/invoice.entity';
import PDFDocument from 'pdfkit';

@Injectable()
export class PdfGenerationService {
  async generateInvoicePdf(invoice: Invoice, language: 'en' | 'ar' = 'en'): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const buffers: Buffer[] = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });

        if (language === 'ar') {
          this.generateArabicInvoice(doc, invoice);
        } else {
          this.generateEnglishInvoice(doc, invoice);
        }

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  private generateEnglishInvoice(doc: PDFKit.PDFDocument, invoice: Invoice) {
    // Header
    doc.fontSize(20).text('TAX INVOICE', 50, 50);
    
    // Invoice details
    doc.fontSize(12).text(`Invoice #: ${invoice.invoiceNumber}`, 400, 50);
    doc.text(`Date: ${invoice.issueDate.toLocaleDateString()}`, 400, 70);
    doc.text(`Due Date: ${invoice.dueDate.toLocaleDateString()}`, 400, 90);

    // Company details
    doc.fontSize(14).text('From:', 50, 130);
    doc.fontSize(12).text(invoice.company.nameEn, 50, 150);
    if (invoice.company.taxRegistrationNumber) {
      doc.text(`TRN: ${invoice.company.taxRegistrationNumber}`, 50, 170);
    }
    if (invoice.company.addressEn) {
      doc.text(invoice.company.addressEn, 50, 190);
    }

    // Customer details
    doc.fontSize(14).text('Bill To:', 300, 130);
    doc.fontSize(12).text(invoice.customer.nameEn, 300, 150);
    if (invoice.customer.taxRegistrationNumber) {
      doc.text(`TRN: ${invoice.customer.taxRegistrationNumber}`, 300, 170);
    }
    if (invoice.customer.addressEn) {
      doc.text(invoice.customer.addressEn, 300, 190);
    }

    // Table headers
    const tableTop = 250;
    doc.fontSize(10);
    doc.text('Description', 50, tableTop);
    doc.text('Qty', 250, tableTop);
    doc.text('Price', 300, tableTop);
    doc.text('Total', 450, tableTop);

    // Draw line under headers
    doc.moveTo(50, tableTop + 15).lineTo(500, tableTop + 15).stroke();

    // Invoice items
    let currentY = tableTop + 30;
    invoice.items.forEach(item => {
      doc.text(item.descriptionEn, 50, currentY);
      doc.text(item.quantity.toString(), 250, currentY);
      doc.text(`${item.unitPrice.toFixed(2)}`, 300, currentY);
      doc.text(`${item.lineTotal.toFixed(2)}`, 450, currentY);
      currentY += 20;
    });

    // Totals
    const totalsY = currentY + 20;
    doc.text('Subtotal:', 350, totalsY);
    doc.text(`${invoice.subtotalAmount.toFixed(2)}`, 450, totalsY);

    if (invoice.discountAmount > 0) {
      doc.text('Discount:', 350, totalsY + 20);
      doc.text(`-${invoice.discountAmount.toFixed(2)}`, 450, totalsY + 20);
    }

    doc.text('VAT:', 350, totalsY + 40);
    doc.text(`${invoice.taxAmount.toFixed(2)}`, 450, totalsY + 40);

    doc.fontSize(12).text('Total:', 350, totalsY + 60);
    doc.text(`${invoice.totalAmount.toFixed(2)}`, 450, totalsY + 60);

    // Notes
    if (invoice.notesEn) {
      doc.text('Notes:', 50, totalsY + 100);
      doc.text(invoice.notesEn, 50, totalsY + 120);
    }

    // Payment method
    if (invoice.paymentMethod) {
      doc.text(`Payment Method: ${invoice.paymentMethod}`, 50, totalsY + 160);
    }
  }

  private generateArabicInvoice(doc: PDFKit.PDFDocument, invoice: Invoice) {
    // Header (RTL)
    doc.fontSize(20).text('فاتورة ضريبية', 400, 50);
    
    // Invoice details (RTL)
    doc.fontSize(12).text(`رقم الفاتورة: ${invoice.invoiceNumber}`, 50, 50);
    doc.text(`التاريخ: ${invoice.issueDate.toLocaleDateString('ar-SA')}`, 50, 70);
    doc.text(`تاريخ الاستحقاق: ${invoice.dueDate.toLocaleDateString('ar-SA')}`, 50, 90);

    // Company details (RTL)
    doc.fontSize(14).text('من:', 450, 130);
    doc.fontSize(12).text(invoice.company.nameEn, 300, 150);
    if (invoice.company.taxRegistrationNumber) {
      doc.text(`الرقم الضريبي: ${invoice.company.taxRegistrationNumber}`, 300, 170);
    }
    if (invoice.company.addressEn) {
      doc.text(invoice.company.addressEn, 300, 190);
    }

    // Customer details (RTL)
    doc.fontSize(14).text('إلى:', 200, 130);
    doc.fontSize(12).text(invoice.customer.nameEn, 50, 150);
    if (invoice.customer.taxRegistrationNumber) {
      doc.text(`الرقم الضريبي: ${invoice.customer.taxRegistrationNumber}`, 50, 170);
    }
    if (invoice.customer.addressEn) {
      doc.text(invoice.customer.addressEn, 50, 190);
    }

    // Table headers (RTL)
    const tableTop = 250;
    doc.fontSize(10);
    doc.text('الوصف', 400, tableTop);
    doc.text('الكمية', 300, tableTop);
    doc.text('السعر', 200, tableTop);
    doc.text('المجموع', 50, tableTop);

    // Draw line under headers
    doc.moveTo(50, tableTop + 15).lineTo(500, tableTop + 15).stroke();

    // Invoice items (RTL)
    let currentY = tableTop + 30;
    invoice.items.forEach(item => {
      doc.text(item.descriptionAr || item.descriptionEn, 300, currentY);
      doc.text(item.quantity.toString(), 250, currentY);
      doc.text(`${item.unitPrice.toFixed(2)}`, 200, currentY);
      doc.text(`${item.lineTotal.toFixed(2)}`, 50, currentY);
      currentY += 20;
    });

    // Totals (RTL)
    const totalsY = currentY + 20;
    doc.text('المجموع الفرعي:', 150, totalsY);
    doc.text(`${invoice.subtotalAmount.toFixed(2)}`, 50, totalsY);

    if (invoice.discountAmount > 0) {
      doc.text('الخصم:', 150, totalsY + 20);
      doc.text(`-${invoice.discountAmount.toFixed(2)}`, 50, totalsY + 20);
    }

    doc.text(`${invoice.taxAmount.toFixed(2)}`, 50, totalsY + 40);
    doc.text('ضريبة القيمة المضافة:', 150, totalsY + 40);

    doc.fontSize(12).text('الإجمالي:', 150, totalsY + 60);
    doc.fontSize(12).text(`${invoice.totalAmount.toFixed(2)}`, 50, totalsY + 60);

    // Notes (RTL)
    if (invoice.notesAr || invoice.notesEn) {
      doc.text('ملاحظات:', 300, totalsY + 100);
      doc.text(invoice.notesAr || invoice.notesEn, 50, totalsY + 120);
    }

    // Payment method (RTL)
    if (invoice.paymentMethod) {
      doc.text(`طريقة الدفع: ${invoice.paymentMethod}`, 300, totalsY + 160);
    }
  }
}