import { Invoice, AppSettings, LineItem } from '../types/invoice';

const STORAGE_KEY_INVOICES = 'quickinvoice_invoices_v1';
const STORAGE_KEY_SETTINGS = 'quickinvoice_settings_v1';

export const DEFAULT_SETTINGS: AppSettings = {
  defaultBusiness: {
    name: 'Apex Design & Tech Studio',
    email: 'billing@apexstudio.dev',
    phone: '+91 98765 43210',
    address: 'Suite 402, Innovate Tower, Cyber City',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560001',
    country: 'India',
    taxId: '29ABCDE1234F1Z5',
    website: 'https://apexstudio.dev',
    logoUrl: '',
  },
  defaultCurrency: 'INR',
  defaultCurrencySymbol: '₹',
  defaultTaxType: 'gst',
  defaultStandardTaxRate: 18,
  defaultStandardTaxLabel: 'GST',
  defaultGstRate: 18,
  defaultGstType: 'cgst_sgst',
  defaultPaymentDetails: {
    bankName: 'HDFC Bank',
    accountName: 'Apex Studio Private Limited',
    accountNumber: '50200012345678',
    ifscOrRouting: 'HDFC0001234',
    swiftBic: 'HDFCINBB',
    upiId: 'apexstudio@hdfcbank',
    paymentLink: 'https://pay.apexstudio.dev',
  },
  defaultTerms: '1. Payment is due within 15 days of invoice date.\n2. Please mention Invoice number in payment transfer remarks.\n3. Late payments are subject to a 1.5% interest charge per month.',
  defaultNotes: 'Thank you for your business! We look forward to collaborating again soon.',
  invoicePrefix: 'INV-2026-',
  nextInvoiceNumber: 104,
  defaultTemplateStyle: 'modern',
  defaultAccentColor: 'terracotta',
};

const SAMPLE_INVOICES: Invoice[] = [
  {
    id: 'inv_sample_101',
    invoiceNumber: 'INV-2026-101',
    poNumber: 'PO-9843',
    date: '2026-10-01',
    dueDate: '2026-10-16',
    status: 'paid',
    seller: {
      name: 'Apex Design & Tech Studio',
      email: 'billing@apexstudio.dev',
      phone: '+91 98765 43210',
      address: 'Suite 402, Innovate Tower, Cyber City',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560001',
      country: 'India',
      taxId: '29ABCDE1234F1Z5',
      website: 'https://apexstudio.dev',
    },
    client: {
      name: 'Priya Sharma',
      companyName: 'Zenith Retail Solutions Pvt Ltd',
      email: 'accounts@zenithretail.in',
      phone: '+91 91234 56789',
      address: 'Building 14, Outer Ring Road, Bellandur',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560103',
      country: 'India',
      taxId: '29ZZZZZ9876A1Z2',
    },
    items: [
      {
        id: 'item_1',
        description: 'E-commerce UI/UX Design Sprint (Figma High-Fidelity & Design System)',
        hsnSac: '998314',
        quantity: 1,
        unitPrice: 85000,
        discountRate: 5,
      },
      {
        id: 'item_2',
        description: 'Responsive Frontend Development (React + Tailwind CSS)',
        hsnSac: '998313',
        quantity: 2,
        unitPrice: 45000,
        discountRate: 0,
      },
      {
        id: 'item_3',
        description: 'Performance Optimization & Lighthouse Audit Tuning',
        hsnSac: '998313',
        quantity: 1,
        unitPrice: 20000,
        discountRate: 0,
      },
    ],
    currency: 'INR',
    currencySymbol: '₹',
    discountType: 'percentage',
    discountValue: 0,
    taxType: 'gst',
    standardTaxRate: 18,
    standardTaxLabel: 'GST',
    gstType: 'cgst_sgst',
    gstRate: 18,
    shippingOrCharges: 0,
    chargesLabel: 'Additional Charges',
    notes: 'Thank you for your business! We appreciate the partnership.',
    terms: 'Payment is due within 15 days of invoice date. Late payments are subject to standard interest.',
    paymentDetails: {
      bankName: 'HDFC Bank',
      accountName: 'Apex Studio Private Limited',
      accountNumber: '50200012345678',
      ifscOrRouting: 'HDFC0001234',
      swiftBic: 'HDFCINBB',
      upiId: 'apexstudio@hdfcbank',
      paymentLink: 'https://pay.apexstudio.dev',
    },
    payments: [
      {
        id: 'pay_1',
        amount: 225085,
        date: '2026-10-12',
        method: 'bank_transfer',
        reference: 'HDFC-NEFT-98471204',
        notes: 'Full payment received with thanks',
      },
    ],
    customization: {
      templateStyle: 'modern',
      accentColor: 'indigo',
      showHsnSac: true,
      showDueDate: true,
      showPaymentDetails: true,
      showSignature: true,
      signatureText: 'Apex Studio Authorized Signatory',
    },
    createdAt: '2026-10-01T10:00:00Z',
    updatedAt: '2026-10-12T15:30:00Z',
  },
  {
    id: 'inv_sample_102',
    invoiceNumber: 'INV-2026-102',
    poNumber: 'PO-1049',
    date: '2026-10-05',
    dueDate: '2026-10-20',
    status: 'partially_paid',
    seller: {
      name: 'Apex Design & Tech Studio',
      email: 'billing@apexstudio.dev',
      phone: '+91 98765 43210',
      address: 'Suite 402, Innovate Tower, Cyber City',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560001',
      country: 'India',
      taxId: '29ABCDE1234F1Z5',
      website: 'https://apexstudio.dev',
    },
    client: {
      name: 'Rahul Varma',
      companyName: 'CloudMatrix Technologies',
      email: 'accounts@cloudmatrix.co',
      phone: '+91 99887 76655',
      address: 'Plot 88, HITEC City, Phase 2',
      city: 'Hyderabad',
      state: 'Telangana',
      postalCode: '500081',
      country: 'India',
      taxId: '36ABCDE9876L1Z4',
    },
    items: [
      {
        id: 'item_201',
        description: 'Cloud Architecture Consulting & Infrastructure Audit',
        hsnSac: '998315',
        quantity: 1,
        unitPrice: 65000,
        discountRate: 0,
      },
      {
        id: 'item_202',
        description: 'Microservices API Integration & Testing Suite',
        hsnSac: '998313',
        quantity: 1,
        unitPrice: 55000,
        discountRate: 10,
      },
    ],
    currency: 'INR',
    currencySymbol: '₹',
    discountType: 'percentage',
    discountValue: 0,
    taxType: 'gst',
    standardTaxRate: 18,
    standardTaxLabel: 'GST',
    gstType: 'igst', // Inter-state Karnataka to Telangana
    gstRate: 18,
    shippingOrCharges: 1500,
    chargesLabel: 'Cloud Server Test Instances',
    notes: 'Interstate GST (IGST 18%) applied as client state is Telangana.',
    terms: 'Payment due on receipt. 50% milestone advance paid.',
    paymentDetails: {
      bankName: 'HDFC Bank',
      accountName: 'Apex Studio Private Limited',
      accountNumber: '50200012345678',
      ifscOrRouting: 'HDFC0001234',
      swiftBic: 'HDFCINBB',
      upiId: 'apexstudio@hdfcbank',
    },
    payments: [
      {
        id: 'pay_201',
        amount: 75000,
        date: '2026-10-06',
        method: 'upi',
        reference: 'UPI-9923841920',
        notes: 'Initial deposit',
      },
    ],
    customization: {
      templateStyle: 'executive',
      accentColor: 'blue',
      showHsnSac: true,
      showDueDate: true,
      showPaymentDetails: true,
      showSignature: true,
      signatureText: 'Apex Studio Authorized Signatory',
    },
    createdAt: '2026-10-05T11:20:00Z',
    updatedAt: '2026-10-06T14:15:00Z',
  },
  {
    id: 'inv_sample_103',
    invoiceNumber: 'INV-2026-103',
    date: '2026-09-20',
    dueDate: '2026-10-05',
    status: 'overdue',
    seller: {
      name: 'Apex Design & Tech Studio',
      email: 'billing@apexstudio.dev',
      phone: '+91 98765 43210',
      address: 'Suite 402, Innovate Tower, Cyber City',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560001',
      country: 'India',
      taxId: '29ABCDE1234F1Z5',
    },
    client: {
      name: 'Ananya Roy',
      companyName: 'Kolkata Artisans Collective',
      email: 'billing@kolkataartisans.org',
      phone: '+91 98301 23456',
      address: '42 Park Street, 3rd Floor',
      city: 'Kolkata',
      state: 'West Bengal',
      postalCode: '700016',
      country: 'India',
    },
    items: [
      {
        id: 'item_301',
        description: 'Brand Identity Design & Product Packaging Guidelines',
        hsnSac: '998314',
        quantity: 1,
        unitPrice: 42000,
        discountRate: 0,
      },
      {
        id: 'item_302',
        description: 'Product Catalog Photography Retouching (50 SKU assets)',
        hsnSac: '998314',
        quantity: 50,
        unitPrice: 500,
        discountRate: 0,
      },
    ],
    currency: 'INR',
    currencySymbol: '₹',
    discountType: 'fixed',
    discountValue: 2000,
    taxType: 'gst',
    standardTaxRate: 18,
    standardTaxLabel: 'GST',
    gstType: 'igst',
    gstRate: 18,
    shippingOrCharges: 0,
    chargesLabel: 'Charges',
    notes: 'Kindly clear the pending balance as the due date has elapsed.',
    terms: 'Payment overdue. Please contact our finance team if you need assistance.',
    paymentDetails: {
      bankName: 'HDFC Bank',
      accountName: 'Apex Studio Private Limited',
      accountNumber: '50200012345678',
      ifscOrRouting: 'HDFC0001234',
      upiId: 'apexstudio@hdfcbank',
    },
    payments: [],
    customization: {
      templateStyle: 'minimal',
      accentColor: 'emerald',
      showHsnSac: true,
      showDueDate: true,
      showPaymentDetails: true,
      showSignature: true,
    },
    createdAt: '2026-09-20T09:00:00Z',
    updatedAt: '2026-09-20T09:00:00Z',
  },
];

export function getSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Error reading settings from localStorage', err);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Error saving settings to localStorage', err);
  }
}

export function getInvoices(): Invoice[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_INVOICES);
    if (!raw) {
      // First run: load samples into storage
      localStorage.setItem(STORAGE_KEY_INVOICES, JSON.stringify(SAMPLE_INVOICES));
      return SAMPLE_INVOICES;
    }
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : SAMPLE_INVOICES;
  } catch (err) {
    console.error('Error reading invoices from localStorage', err);
    return SAMPLE_INVOICES;
  }
}

export function saveInvoice(invoice: Invoice): void {
  try {
    const invoices = getInvoices();
    const existingIndex = invoices.findIndex(i => i.id === invoice.id);
    
    if (existingIndex >= 0) {
      invoices[existingIndex] = {
        ...invoice,
        updatedAt: new Date().toISOString(),
      };
    } else {
      invoices.unshift({
        ...invoice,
        createdAt: invoice.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      // Increment next invoice number in settings if it matches the pattern
      const settings = getSettings();
      const numMatch = invoice.invoiceNumber.match(/(\d+)$/);
      if (numMatch) {
        const parsedNum = parseInt(numMatch[1], 10);
        if (parsedNum >= settings.nextInvoiceNumber) {
          saveSettings({ ...settings, nextInvoiceNumber: parsedNum + 1 });
        }
      }
    }

    localStorage.setItem(STORAGE_KEY_INVOICES, JSON.stringify(invoices));
  } catch (err) {
    console.error('Error saving invoice to localStorage', err);
    throw err;
  }
}

export function deleteInvoice(id: string): void {
  try {
    const invoices = getInvoices().filter(i => i.id !== id);
    localStorage.setItem(STORAGE_KEY_INVOICES, JSON.stringify(invoices));
  } catch (err) {
    console.error('Error deleting invoice from localStorage', err);
    throw err;
  }
}

export function getInvoiceById(id: string): Invoice | undefined {
  const invoices = getInvoices();
  return invoices.find(i => i.id === id);
}

export function getNextInvoiceNumber(settings?: AppSettings): string {
  const cfg = settings || getSettings();
  const padLength = 3;
  const numStr = String(cfg.nextInvoiceNumber).padStart(padLength, '0');
  return `${cfg.invoicePrefix}${numStr}`;
}

export function createBlankInvoice(settings?: AppSettings): Invoice {
  const cfg = settings || getSettings();
  const today = new Date().toISOString().split('T')[0];
  
  // Default due date: 15 days later
  const dueDateObj = new Date();
  dueDateObj.setDate(dueDateObj.getDate() + 15);
  const defaultDueDate = dueDateObj.toISOString().split('T')[0];

  const defaultItem: LineItem = {
    id: `item_${Date.now()}`,
    description: '',
    hsnSac: '',
    quantity: 1,
    unitPrice: 0,
    discountRate: 0,
  };

  return {
    id: `inv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    invoiceNumber: getNextInvoiceNumber(cfg),
    poNumber: '',
    date: today,
    dueDate: defaultDueDate,
    status: 'unpaid',
    seller: { ...cfg.defaultBusiness },
    client: {
      name: '',
      companyName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: cfg.defaultBusiness.country || 'India',
      taxId: '',
    },
    items: [defaultItem],
    currency: cfg.defaultCurrency,
    currencySymbol: cfg.defaultCurrencySymbol,
    discountType: 'percentage',
    discountValue: 0,
    taxType: cfg.defaultTaxType,
    standardTaxRate: cfg.defaultStandardTaxRate,
    standardTaxLabel: cfg.defaultStandardTaxLabel,
    gstType: cfg.defaultGstType,
    gstRate: cfg.defaultGstRate,
    shippingOrCharges: 0,
    chargesLabel: 'Shipping / Additional Charges',
    notes: cfg.defaultNotes,
    terms: cfg.defaultTerms,
    paymentDetails: { ...cfg.defaultPaymentDetails },
    payments: [],
    customization: {
      templateStyle: cfg.defaultTemplateStyle,
      accentColor: cfg.defaultAccentColor,
      showHsnSac: cfg.defaultTaxType === 'gst',
      showDueDate: true,
      showPaymentDetails: true,
      showSignature: true,
      signatureText: `${cfg.defaultBusiness.name || 'Seller'} Authorized Signatory`,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function exportBackupData(): string {
  const invoices = getInvoices();
  const settings = getSettings();
  const payload = {
    app: 'QuickInvoice',
    version: '1.0',
    exportDate: new Date().toISOString(),
    invoices,
    settings,
  };
  return JSON.stringify(payload, null, 2);
}

export function importBackupData(jsonString: string): { success: boolean; count?: number; error?: string } {
  try {
    const data = JSON.parse(jsonString);
    if (!data || typeof data !== 'object') {
      return { success: false, error: 'Invalid JSON file format.' };
    }

    if (Array.isArray(data.invoices)) {
      localStorage.setItem(STORAGE_KEY_INVOICES, JSON.stringify(data.invoices));
    }

    if (data.settings && typeof data.settings === 'object') {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(data.settings));
    }

    const count = Array.isArray(data.invoices) ? data.invoices.length : 0;
    return { success: true, count };
  } catch (err) {
    return { success: false, error: (err as Error).message || 'Failed to parse JSON backup.' };
  }
}

export function resetToSampleData(): void {
  localStorage.setItem(STORAGE_KEY_INVOICES, JSON.stringify(SAMPLE_INVOICES));
  localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
}
