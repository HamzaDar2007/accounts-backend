export const FTA_COMPLIANT_TEMPLATE_EN = {
  header: {
    title: 'TAX INVOICE',
    titlePosition: 'center',
    fontSize: 20,
    fontWeight: 'bold'
  },
  companyInfo: {
    position: 'left',
    fields: [
      { key: 'name', label: 'Company Name', required: true },
      { key: 'trn', label: 'TRN', required: true, format: 'TRN: {value}' },
      { key: 'address', label: 'Address', required: false },
      { key: 'phone', label: 'Phone', required: false },
      { key: 'email', label: 'Email', required: false }
    ]
  },
  customerInfo: {
    position: 'right',
    title: 'Bill To:',
    fields: [
      { key: 'name', label: 'Customer Name', required: true },
      { key: 'trn', label: 'TRN', required: false, format: 'TRN: {value}' },
      { key: 'address', label: 'Address', required: false }
    ]
  },
  invoiceDetails: {
    position: 'right',
    fields: [
      { key: 'invoiceNumber', label: 'Invoice #', required: true },
      { key: 'invoiceDate', label: 'Invoice Date', required: true, format: 'date' },
      { key: 'dueDate', label: 'Due Date', required: true, format: 'date' }
    ]
  },
  itemsTable: {
    headers: ['Description', 'Qty', 'Unit Price', 'VAT Rate', 'Line Total'],
    columns: ['description', 'quantity', 'unitPrice', 'vatRate', 'lineTotal'],
    showVatBreakdown: true
  },
  totals: {
    position: 'right',
    fields: [
      { key: 'subtotal', label: 'Subtotal', format: 'currency' },
      { key: 'discountAmount', label: 'Discount', format: 'currency', showIf: 'hasDiscount' },
      { key: 'vatAmount', label: 'VAT Amount', format: 'currency', required: true },
      { key: 'totalAmount', label: 'Total Amount', format: 'currency', fontWeight: 'bold' }
    ]
  },
  footer: {
    fields: [
      { key: 'notes', label: 'Notes', type: 'text' },
      { key: 'paymentMethod', label: 'Payment Method', type: 'text' }
    ]
  },
  compliance: {
    ftaCompliant: true,
    showVatBreakdown: true,
    requireTrn: true
  }
};

export const FTA_COMPLIANT_TEMPLATE_AR = {
  header: {
    title: 'فاتورة ضريبية',
    titlePosition: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    direction: 'rtl'
  },
  companyInfo: {
    position: 'right',
    direction: 'rtl',
    fields: [
      { key: 'name', label: 'اسم الشركة', required: true },
      { key: 'trn', label: 'الرقم الضريبي', required: true, format: 'الرقم الضريبي: {value}' },
      { key: 'address', label: 'العنوان', required: false },
      { key: 'phone', label: 'الهاتف', required: false },
      { key: 'email', label: 'البريد الإلكتروني', required: false }
    ]
  },
  customerInfo: {
    position: 'left',
    title: 'إلى:',
    direction: 'rtl',
    fields: [
      { key: 'name', label: 'اسم العميل', required: true },
      { key: 'trn', label: 'الرقم الضريبي', required: false, format: 'الرقم الضريبي: {value}' },
      { key: 'address', label: 'العنوان', required: false }
    ]
  },
  invoiceDetails: {
    position: 'left',
    direction: 'rtl',
    fields: [
      { key: 'invoiceNumber', label: 'رقم الفاتورة', required: true },
      { key: 'invoiceDate', label: 'تاريخ الفاتورة', required: true, format: 'date' },
      { key: 'dueDate', label: 'تاريخ الاستحقاق', required: true, format: 'date' }
    ]
  },
  itemsTable: {
    headers: ['الوصف', 'الكمية', 'سعر الوحدة', 'معدل الضريبة', 'المجموع'],
    columns: ['descriptionAr', 'quantity', 'unitPrice', 'vatRate', 'lineTotal'],
    direction: 'rtl',
    showVatBreakdown: true
  },
  totals: {
    position: 'left',
    direction: 'rtl',
    fields: [
      { key: 'subtotal', label: 'المجموع الفرعي', format: 'currency' },
      { key: 'discountAmount', label: 'الخصم', format: 'currency', showIf: 'hasDiscount' },
      { key: 'vatAmount', label: 'مبلغ الضريبة', format: 'currency', required: true },
      { key: 'totalAmount', label: 'المبلغ الإجمالي', format: 'currency', fontWeight: 'bold' }
    ]
  },
  footer: {
    direction: 'rtl',
    fields: [
      { key: 'notesAr', label: 'ملاحظات', type: 'text' },
      { key: 'paymentMethod', label: 'طريقة الدفع', type: 'text' }
    ]
  },
  compliance: {
    ftaCompliant: true,
    showVatBreakdown: true,
    requireTrn: true
  }
};