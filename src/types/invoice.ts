export type InvoiceStatus = 'draft' | 'unpaid' | 'partially_paid' | 'paid' | 'overdue';

export type TaxType = 'none' | 'standard' | 'gst';

export type GSTType = 'cgst_sgst' | 'igst';

export type DiscountType = 'percentage' | 'fixed';

export interface LineItem {
  id: string;
  description: string;
  hsnSac?: string; // Optional HSN/SAC code for GST compliance
  quantity: number;
  unitPrice: number;
  discountRate?: number; // Optional item-level discount percentage
  taxRate?: number;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  date: string;
  method: 'bank_transfer' | 'upi' | 'cash' | 'credit_card' | 'cheque' | 'paypal' | 'other';
  reference?: string;
  notes?: string;
}

export interface BusinessDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  taxId?: string; // GSTIN / VAT / PAN / EIN
  website?: string;
  logoUrl?: string; // base64 or url
}

export interface ClientDetails {
  name: string;
  companyName?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  taxId?: string; // GSTIN / VAT
}

export interface BankPaymentDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  ifscOrRouting: string;
  swiftBic?: string;
  upiId?: string;
  paymentLink?: string;
}

export type TemplateStyle = 'modern' | 'minimal' | 'executive' | 'creative';
export type AccentColor = 'terracotta' | 'amber' | 'peach' | 'espresso' | 'sage' | 'rosewood' | 'indigo' | 'blue' | 'emerald' | 'slate' | 'violet';

export interface InvoiceCustomization {
  templateStyle: TemplateStyle;
  accentColor: AccentColor;
  showHsnSac: boolean;
  showDueDate: boolean;
  showPaymentDetails: boolean;
  showSignature: boolean;
  signatureText?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  poNumber?: string;
  date: string;
  dueDate: string;
  status: InvoiceStatus;
  
  // Parties
  seller: BusinessDetails;
  client: ClientDetails;
  
  // Line items
  items: LineItem[];
  
  // Currency & Tax config
  currency: string;
  currencySymbol: string;
  
  // Discounts
  discountType: DiscountType;
  discountValue: number; // percentage (0-100) or fixed amount
  
  // Tax
  taxType: TaxType;
  standardTaxRate: number; // e.g., 18 for 18%
  standardTaxLabel: string; // e.g. "VAT" or "Sales Tax"
  
  // GST specific
  gstType: GSTType;
  gstRate: number; // e.g., 18 -> CGST 9% + SGST 9% OR IGST 18%
  
  // Additional charges
  shippingOrCharges: number;
  chargesLabel: string; // "Shipping & Handling", "Delivery", etc.
  
  // Notes & terms
  notes: string;
  terms: string;
  
  // Payment instructions
  paymentDetails: BankPaymentDetails;
  
  // Payment tracking
  payments: PaymentRecord[];
  
  // Customization
  customization: InvoiceCustomization;

  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  defaultBusiness: BusinessDetails;
  defaultCurrency: string;
  defaultCurrencySymbol: string;
  defaultTaxType: TaxType;
  defaultStandardTaxRate: number;
  defaultStandardTaxLabel: string;
  defaultGstRate: number;
  defaultGstType: GSTType;
  defaultPaymentDetails: BankPaymentDetails;
  defaultTerms: string;
  defaultNotes: string;
  invoicePrefix: string;
  nextInvoiceNumber: number;
  defaultTemplateStyle: TemplateStyle;
  defaultAccentColor: AccentColor;
}

export interface CalculationResult {
  itemsSubtotal: number;
  totalItemDiscount: number;
  netItemsSubtotal: number;
  invoiceDiscountAmount: number;
  taxableAmount: number;
  taxAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  shippingCharges: number;
  grandTotal: number;
  totalPaid: number;
  outstandingBalance: number;
}
