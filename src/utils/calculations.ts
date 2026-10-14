import { Invoice, LineItem, CalculationResult, InvoiceStatus } from '../types/invoice';

/**
 * Calculates a single line item total (quantity * unitPrice, minus line discount)
 */
export function calculateLineItemTotal(item: LineItem): number {
  const qty = Math.max(0, Number(item.quantity) || 0);
  const price = Math.max(0, Number(item.unitPrice) || 0);
  const discountRate = Math.min(100, Math.max(0, Number(item.discountRate) || 0));
  
  const rawSubtotal = qty * price;
  const lineDiscount = (rawSubtotal * discountRate) / 100;
  return Math.max(0, Math.round((rawSubtotal - lineDiscount) * 100) / 100);
}

/**
 * Calculates line item gross (before line discount)
 */
export function calculateLineItemGross(item: LineItem): number {
  const qty = Math.max(0, Number(item.quantity) || 0);
  const price = Math.max(0, Number(item.unitPrice) || 0);
  return Math.round(qty * price * 100) / 100;
}

/**
 * Calculates the complete invoice figures
 */
export function calculateInvoice(invoice: Partial<Invoice>): CalculationResult {
  const items = invoice.items || [];
  
  let rawGrossSum = 0;
  let totalItemDiscount = 0;
  let netItemsSubtotal = 0;

  for (const item of items) {
    const gross = calculateLineItemGross(item);
    const net = calculateLineItemTotal(item);
    rawGrossSum += gross;
    totalItemDiscount += (gross - net);
    netItemsSubtotal += net;
  }

  // Invoice-level discount
  let invoiceDiscountAmount = 0;
  const discountVal = Math.max(0, Number(invoice.discountValue) || 0);

  if (invoice.discountType === 'percentage') {
    const pct = Math.min(100, discountVal);
    invoiceDiscountAmount = Math.round((netItemsSubtotal * pct / 100) * 100) / 100;
  } else {
    // Fixed amount
    invoiceDiscountAmount = Math.min(netItemsSubtotal, discountVal);
  }

  const taxableAmount = Math.max(0, Math.round((netItemsSubtotal - invoiceDiscountAmount) * 100) / 100);

  // Tax calculations
  let taxAmount = 0;
  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;

  if (invoice.taxType === 'standard') {
    const rate = Math.max(0, Number(invoice.standardTaxRate) || 0);
    taxAmount = Math.round((taxableAmount * (rate / 100)) * 100) / 100;
  } else if (invoice.taxType === 'gst') {
    const gstRate = Math.max(0, Number(invoice.gstRate) || 0);
    if (invoice.gstType === 'cgst_sgst') {
      const halfRate = gstRate / 2;
      cgstAmount = Math.round((taxableAmount * (halfRate / 100)) * 100) / 100;
      sgstAmount = Math.round((taxableAmount * (halfRate / 100)) * 100) / 100;
      taxAmount = Math.round((cgstAmount + sgstAmount) * 100) / 100;
    } else {
      igstAmount = Math.round((taxableAmount * (gstRate / 100)) * 100) / 100;
      taxAmount = igstAmount;
    }
  }

  // Extra charges (e.g. shipping / handling)
  const shippingCharges = Math.max(0, Number(invoice.shippingOrCharges) || 0);

  // Grand total
  const grandTotal = Math.round((taxableAmount + taxAmount + shippingCharges) * 100) / 100;

  // Payments & Balance
  const payments = invoice.payments || [];
  const totalPaid = payments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
  const roundedPaid = Math.round(totalPaid * 100) / 100;
  const outstandingBalance = Math.max(0, Math.round((grandTotal - roundedPaid) * 100) / 100);

  return {
    itemsSubtotal: Math.round(rawGrossSum * 100) / 100,
    totalItemDiscount: Math.round(totalItemDiscount * 100) / 100,
    netItemsSubtotal: Math.round(netItemsSubtotal * 100) / 100,
    invoiceDiscountAmount,
    taxableAmount,
    taxAmount,
    cgstAmount,
    sgstAmount,
    igstAmount,
    shippingCharges,
    grandTotal,
    totalPaid: roundedPaid,
    outstandingBalance,
  };
}

/**
 * Computes the real status based on due date, payments and current status
 */
export function getComputedInvoiceStatus(invoice: Invoice): InvoiceStatus {
  if (invoice.status === 'draft') return 'draft';

  const calc = calculateInvoice(invoice);
  
  if (calc.grandTotal > 0 && calc.outstandingBalance <= 0) {
    return 'paid';
  }

  if (calc.totalPaid > 0 && calc.outstandingBalance > 0) {
    return 'partially_paid';
  }

  // Check if overdue
  if (invoice.dueDate) {
    const due = new Date(invoice.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    if (due < today && calc.outstandingBalance > 0) {
      return 'overdue';
    }
  }

  return 'unpaid';
}
