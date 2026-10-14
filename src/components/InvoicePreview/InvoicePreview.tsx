import React from 'react';
import { Invoice, AccentColor, TemplateStyle } from '../../types/invoice';
import { calculateInvoice } from '../../utils/calculations';
import { formatCurrency, amountInWords } from '../../utils/currency';
import { StatusBadge } from '../common/Badge';
import { Building2, Mail, Phone, Globe, Landmark, QrCode } from 'lucide-react';

interface InvoicePreviewProps {
  invoice: Invoice;
  id?: string;
}

const ACCENT_STYLES: Record<AccentColor, {
  primary: string;
  bgLight: string;
  borderLight: string;
  textPrimary: string;
  badgeBg: string;
  headerBar: string;
  tableHead: string;
}> = {
  terracotta: {
    primary: 'bg-gradient-to-r from-orange-600 via-amber-600 to-amber-500 text-white shadow-sm',
    bgLight: 'bg-orange-50/80',
    borderLight: 'border-orange-200/80',
    textPrimary: 'text-orange-700',
    badgeBg: 'bg-orange-100 text-orange-950',
    headerBar: 'border-t-4 border-orange-600',
    tableHead: 'bg-orange-50/90 text-orange-950 border-orange-200/80',
  },
  amber: {
    primary: 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-sm',
    bgLight: 'bg-amber-50/80',
    borderLight: 'border-amber-200/80',
    textPrimary: 'text-amber-800',
    badgeBg: 'bg-amber-100 text-amber-950',
    headerBar: 'border-t-4 border-amber-600',
    tableHead: 'bg-amber-50/90 text-amber-950 border-amber-200/80',
  },
  peach: {
    primary: 'bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white shadow-sm',
    bgLight: 'bg-rose-50/70',
    borderLight: 'border-rose-200/80',
    textPrimary: 'text-rose-700',
    badgeBg: 'bg-rose-100 text-rose-950',
    headerBar: 'border-t-4 border-rose-500',
    tableHead: 'bg-rose-50/90 text-rose-950 border-rose-200/80',
  },
  espresso: {
    primary: 'bg-stone-900 text-white shadow-sm',
    bgLight: 'bg-stone-100/80',
    borderLight: 'border-stone-200',
    textPrimary: 'text-stone-900',
    badgeBg: 'bg-stone-200 text-stone-900',
    headerBar: 'border-t-4 border-stone-900',
    tableHead: 'bg-stone-100 text-stone-900 border-stone-200',
  },
  sage: {
    primary: 'bg-emerald-700 text-white shadow-sm',
    bgLight: 'bg-emerald-50/70',
    borderLight: 'border-emerald-200',
    textPrimary: 'text-emerald-800',
    badgeBg: 'bg-emerald-100 text-emerald-950',
    headerBar: 'border-t-4 border-emerald-700',
    tableHead: 'bg-emerald-50 text-emerald-950 border-emerald-200',
  },
  rosewood: {
    primary: 'bg-rose-800 text-white shadow-sm',
    bgLight: 'bg-rose-50/70',
    borderLight: 'border-rose-200',
    textPrimary: 'text-rose-800',
    badgeBg: 'bg-rose-100 text-rose-950',
    headerBar: 'border-t-4 border-rose-800',
    tableHead: 'bg-rose-50 text-rose-950 border-rose-200',
  },
  indigo: {
    primary: 'bg-indigo-600 text-white',
    bgLight: 'bg-indigo-50/70',
    borderLight: 'border-indigo-100',
    textPrimary: 'text-indigo-600',
    badgeBg: 'bg-indigo-100 text-indigo-800',
    headerBar: 'border-t-4 border-indigo-600',
    tableHead: 'bg-indigo-50/80 text-indigo-900 border-indigo-100',
  },
  blue: {
    primary: 'bg-blue-600 text-white',
    bgLight: 'bg-blue-50/70',
    borderLight: 'border-blue-100',
    textPrimary: 'text-blue-600',
    badgeBg: 'bg-blue-100 text-blue-800',
    headerBar: 'border-t-4 border-blue-600',
    tableHead: 'bg-blue-50/80 text-blue-900 border-blue-100',
  },
  emerald: {
    primary: 'bg-emerald-600 text-white',
    bgLight: 'bg-emerald-50/70',
    borderLight: 'border-emerald-100',
    textPrimary: 'text-emerald-600',
    badgeBg: 'bg-emerald-100 text-emerald-800',
    headerBar: 'border-t-4 border-emerald-600',
    tableHead: 'bg-emerald-50/80 text-emerald-900 border-emerald-100',
  },
  slate: {
    primary: 'bg-slate-800 text-white',
    bgLight: 'bg-slate-100/70',
    borderLight: 'border-slate-200',
    textPrimary: 'text-slate-800',
    badgeBg: 'bg-slate-200 text-slate-800',
    headerBar: 'border-t-4 border-slate-800',
    tableHead: 'bg-slate-100 text-slate-900 border-slate-200',
  },
  violet: {
    primary: 'bg-violet-600 text-white',
    bgLight: 'bg-violet-50/70',
    borderLight: 'border-violet-100',
    textPrimary: 'text-violet-600',
    badgeBg: 'bg-violet-100 text-violet-800',
    headerBar: 'border-t-4 border-violet-600',
    tableHead: 'bg-violet-50/80 text-violet-900 border-violet-100',
  },
};

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  invoice,
  id = 'invoice-render-target',
}) => {
  const calc = calculateInvoice(invoice);
  const color = invoice.customization?.accentColor || 'terracotta';
  const style = invoice.customization?.templateStyle || 'modern';
  const theme = ACCENT_STYLES[color] || ACCENT_STYLES.terracotta;

  const showHsn = invoice.customization?.showHsnSac && invoice.taxType === 'gst';
  const showPayment = invoice.customization?.showPaymentDetails !== false;
  const showSignature = invoice.customization?.showSignature !== false;

  const seller = invoice.seller || {};
  const client = invoice.client || {};

  return (
    <div
      id={id}
      className={`print-container bg-white text-slate-800 rounded-xl shadow-md border border-slate-200/80 p-8 sm:p-10 max-w-4xl mx-auto transition-all ${
        style === 'modern' ? theme.headerBar : ''
      }`}
      style={{ minHeight: '1050px' }}
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-8 border-b border-slate-200">
        <div className="flex items-start gap-4">
          {seller.logoUrl ? (
            <img
              src={seller.logoUrl}
              alt={seller.name || 'Company Logo'}
              className="w-16 h-16 object-contain rounded-lg border border-slate-100 p-1"
            />
          ) : (
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl ${theme.primary}`}>
              {seller.name ? seller.name.substring(0, 2).toUpperCase() : 'QI'}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {seller.name || 'Your Business Name'}
            </h1>
            {seller.taxId && (
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                <span className="font-semibold text-slate-700">Tax / GSTIN ID:</span> {seller.taxId}
              </p>
            )}
            <div className="text-xs text-slate-600 mt-1.5 space-y-0.5">
              {seller.address && <p>{seller.address}</p>}
              {(seller.city || seller.state || seller.postalCode) && (
                <p>
                  {[seller.city, seller.state, seller.postalCode].filter(Boolean).join(', ')}
                  {seller.country ? ` (${seller.country})` : ''}
                </p>
              )}
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 pt-0.5 text-slate-500">
                {seller.email && (
                  <span className="inline-flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-400" /> {seller.email}
                  </span>
                )}
                {seller.phone && (
                  <span className="inline-flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" /> {seller.phone}
                  </span>
                )}
                {seller.website && (
                  <span className="inline-flex items-center gap-1">
                    <Globe className="w-3 h-3 text-slate-400" /> {seller.website.replace(/^https?:\/\//, '')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Title & Meta */}
        <div className="text-left sm:text-right shrink-0 w-full sm:w-auto">
          <div className="flex sm:justify-end items-center gap-2 mb-1">
            <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${theme.textPrimary}`}>
              INVOICE
            </span>
            <StatusBadge status={invoice.status} size="md" />
          </div>
          <p className="font-mono text-sm font-bold text-slate-800">
            #{invoice.invoiceNumber || 'INV-0001'}
          </p>

          <div className="mt-3 text-xs space-y-1 text-slate-600">
            <div className="flex sm:justify-end gap-3">
              <span className="text-slate-400 font-medium">Invoice Date:</span>
              <span className="font-semibold text-slate-700">{invoice.date || '—'}</span>
            </div>
            {invoice.customization?.showDueDate !== false && (
              <div className="flex sm:justify-end gap-3">
                <span className="text-slate-400 font-medium">Due Date:</span>
                <span className="font-semibold text-slate-700">{invoice.dueDate || '—'}</span>
              </div>
            )}
            {invoice.poNumber && (
              <div className="flex sm:justify-end gap-3">
                <span className="text-slate-400 font-medium">P.O. Number:</span>
                <span className="font-semibold text-slate-700">{invoice.poNumber}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bill To & Bill From Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 p-4 rounded-xl bg-slate-50/70 border border-slate-100">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Billed To
          </span>
          <h2 className="text-base font-bold text-slate-900 mt-1">
            {client.companyName ? (
              <>
                {client.companyName}
                {client.name && <span className="block text-sm font-normal text-slate-600">Attn: {client.name}</span>}
              </>
            ) : (
              client.name || 'Client Name'
            )}
          </h2>
          {client.taxId && (
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              <span className="font-semibold text-slate-600">GSTIN / Tax ID:</span> {client.taxId}
            </p>
          )}
          <div className="text-xs text-slate-600 mt-1 space-y-0.5">
            {client.address && <p>{client.address}</p>}
            {(client.city || client.state || client.postalCode) && (
              <p>
                {[client.city, client.state, client.postalCode].filter(Boolean).join(', ')}
                {client.country ? ` (${client.country})` : ''}
              </p>
            )}
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 pt-0.5 text-slate-500">
              {client.email && <span>{client.email}</span>}
              {client.phone && <span>{client.phone}</span>}
            </div>
          </div>
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Payment Summary
          </span>
          <div className="mt-2 space-y-1.5 text-xs">
            <div className="flex justify-between items-center text-slate-600">
              <span>Invoice Total:</span>
              <span className="font-semibold text-slate-900">
                {formatCurrency(calc.grandTotal, invoice.currency, invoice.currencySymbol)}
              </span>
            </div>
            {calc.totalPaid > 0 && (
              <div className="flex justify-between items-center text-emerald-700">
                <span>Amount Paid:</span>
                <span className="font-semibold">
                  - {formatCurrency(calc.totalPaid, invoice.currency, invoice.currencySymbol)}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center pt-1.5 border-t border-slate-200">
              <span className="font-bold text-slate-800">Balance Due:</span>
              <span className={`font-bold text-sm ${calc.outstandingBalance > 0 ? theme.textPrimary : 'text-emerald-700'}`}>
                {formatCurrency(calc.outstandingBalance, invoice.currency, invoice.currencySymbol)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Itemized Table */}
      <div className="overflow-x-auto my-6">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className={`border-b ${theme.tableHead}`}>
              <th className="py-2.5 px-3 font-semibold w-10 text-center">#</th>
              <th className="py-2.5 px-3 font-semibold">Description</th>
              {showHsn && <th className="py-2.5 px-3 font-semibold text-center w-20">HSN/SAC</th>}
              <th className="py-2.5 px-3 font-semibold text-right w-16">Qty</th>
              <th className="py-2.5 px-3 font-semibold text-right w-24">Unit Price</th>
              {calc.totalItemDiscount > 0 && (
                <th className="py-2.5 px-3 font-semibold text-right w-20">Disc (%)</th>
              )}
              <th className="py-2.5 px-3 font-semibold text-right w-28">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoice.items && invoice.items.length > 0 ? (
              invoice.items.map((item, idx) => {
                const qty = Math.max(0, Number(item.quantity) || 0);
                const price = Math.max(0, Number(item.unitPrice) || 0);
                const discount = Math.max(0, Number(item.discountRate) || 0);
                const lineGross = qty * price;
                const lineTotal = lineGross * (1 - discount / 100);

                return (
                  <tr key={item.id || idx} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-3 px-3 text-slate-800 font-medium whitespace-pre-wrap">
                      {item.description || 'Item description'}
                    </td>
                    {showHsn && (
                      <td className="py-3 px-3 text-center text-slate-500 font-mono">
                        {item.hsnSac || '—'}
                      </td>
                    )}
                    <td className="py-3 px-3 text-right text-slate-700 font-mono">{qty}</td>
                    <td className="py-3 px-3 text-right text-slate-700 font-mono">
                      {formatCurrency(price, invoice.currency, invoice.currencySymbol)}
                    </td>
                    {calc.totalItemDiscount > 0 && (
                      <td className="py-3 px-3 text-right text-slate-500 font-mono">
                        {discount > 0 ? `${discount}%` : '—'}
                      </td>
                    )}
                    <td className="py-3 px-3 text-right font-semibold text-slate-900 font-mono">
                      {formatCurrency(lineTotal, invoice.currency, invoice.currencySymbol)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-6 text-center text-slate-400 italic">
                  No items added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Calculation Summary & Breakdown */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-8 my-6 pt-4 border-t border-slate-200">
        {/* Left Column: Bank / UPI Details */}
        <div className="w-full sm:w-1/2 space-y-4">
          {showPayment && (invoice.paymentDetails.bankName || invoice.paymentDetails.upiId) && (
            <div className={`p-4 rounded-xl border ${theme.borderLight} ${theme.bgLight} text-xs`}>
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
                <Landmark className="w-4 h-4 text-slate-600" />
                <span>Payment Instructions</span>
              </div>
              <div className="space-y-1 text-slate-700 font-mono">
                {invoice.paymentDetails.bankName && (
                  <p><span className="text-slate-500 font-sans">Bank:</span> {invoice.paymentDetails.bankName}</p>
                )}
                {invoice.paymentDetails.accountName && (
                  <p><span className="text-slate-500 font-sans">A/C Name:</span> {invoice.paymentDetails.accountName}</p>
                )}
                {invoice.paymentDetails.accountNumber && (
                  <p><span className="text-slate-500 font-sans">A/C No:</span> {invoice.paymentDetails.accountNumber}</p>
                )}
                {invoice.paymentDetails.ifscOrRouting && (
                  <p><span className="text-slate-500 font-sans">IFSC / Code:</span> {invoice.paymentDetails.ifscOrRouting}</p>
                )}
                {invoice.paymentDetails.swiftBic && (
                  <p><span className="text-slate-500 font-sans">SWIFT/BIC:</span> {invoice.paymentDetails.swiftBic}</p>
                )}
                {invoice.paymentDetails.upiId && (
                  <div className="pt-1 mt-1 border-t border-slate-200/60 flex items-center gap-1.5 text-indigo-900 font-semibold">
                    <QrCode className="w-3.5 h-3.5" />
                    <span>UPI ID: {invoice.paymentDetails.upiId}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Amount in words */}
          {calc.grandTotal > 0 && (
            <div className="text-xs text-slate-600">
              <span className="font-semibold text-slate-700">Amount in Words:</span>
              <p className="italic text-slate-800 capitalize mt-0.5 font-serif">
                {amountInWords(calc.grandTotal, invoice.currency)}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Breakdown Table */}
        <div className="w-full sm:w-72 shrink-0 space-y-2 text-xs">
          <div className="flex justify-between py-1 text-slate-600">
            <span>Subtotal:</span>
            <span className="font-semibold text-slate-800 font-mono">
              {formatCurrency(calc.netItemsSubtotal, invoice.currency, invoice.currencySymbol)}
            </span>
          </div>

          {calc.invoiceDiscountAmount > 0 && (
            <div className="flex justify-between py-1 text-emerald-700">
              <span>
                Discount {invoice.discountType === 'percentage' ? `(${invoice.discountValue}%)` : ''}:
              </span>
              <span className="font-semibold font-mono">
                - {formatCurrency(calc.invoiceDiscountAmount, invoice.currency, invoice.currencySymbol)}
              </span>
            </div>
          )}

          {/* Tax Breakdown */}
          {invoice.taxType === 'standard' && invoice.standardTaxRate > 0 && (
            <div className="flex justify-between py-1 text-slate-600">
              <span>{invoice.standardTaxLabel || 'Tax'} ({invoice.standardTaxRate}%):</span>
              <span className="font-semibold text-slate-800 font-mono">
                {formatCurrency(calc.taxAmount, invoice.currency, invoice.currencySymbol)}
              </span>
            </div>
          )}

          {invoice.taxType === 'gst' && invoice.gstType === 'cgst_sgst' && (
            <>
              <div className="flex justify-between py-1 text-slate-600">
                <span>CGST ({invoice.gstRate / 2}%):</span>
                <span className="font-semibold text-slate-800 font-mono">
                  {formatCurrency(calc.cgstAmount, invoice.currency, invoice.currencySymbol)}
                </span>
              </div>
              <div className="flex justify-between py-1 text-slate-600">
                <span>SGST ({invoice.gstRate / 2}%):</span>
                <span className="font-semibold text-slate-800 font-mono">
                  {formatCurrency(calc.sgstAmount, invoice.currency, invoice.currencySymbol)}
                </span>
              </div>
            </>
          )}

          {invoice.taxType === 'gst' && invoice.gstType === 'igst' && (
            <div className="flex justify-between py-1 text-slate-600">
              <span>IGST ({invoice.gstRate}%):</span>
              <span className="font-semibold text-slate-800 font-mono">
                {formatCurrency(calc.igstAmount, invoice.currency, invoice.currencySymbol)}
              </span>
            </div>
          )}

          {calc.shippingCharges > 0 && (
            <div className="flex justify-between py-1 text-slate-600">
              <span>{invoice.chargesLabel || 'Charges'}:</span>
              <span className="font-semibold text-slate-800 font-mono">
                {formatCurrency(calc.shippingCharges, invoice.currency, invoice.currencySymbol)}
              </span>
            </div>
          )}

          {/* Grand Total Highlight Box */}
          <div className={`flex justify-between items-center p-3 rounded-lg font-bold text-sm mt-3 ${theme.primary}`}>
            <span>Total Amount:</span>
            <span className="text-base font-mono">
              {formatCurrency(calc.grandTotal, invoice.currency, invoice.currencySymbol)}
            </span>
          </div>

          {/* Balance Due Row */}
          {calc.totalPaid > 0 && (
            <>
              <div className="flex justify-between py-1 text-emerald-700 font-semibold">
                <span>Total Received:</span>
                <span className="font-mono">
                  {formatCurrency(calc.totalPaid, invoice.currency, invoice.currencySymbol)}
                </span>
              </div>
              <div className="flex justify-between py-1 text-slate-900 font-bold border-t border-slate-200 pt-1.5">
                <span>Balance Due:</span>
                <span className={`font-mono text-sm ${calc.outstandingBalance > 0 ? theme.textPrimary : 'text-emerald-700'}`}>
                  {formatCurrency(calc.outstandingBalance, invoice.currency, invoice.currencySymbol)}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Notes, Terms & Conditions & Signatory */}
      <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-600 avoid-break">
        <div className="sm:col-span-2 space-y-3">
          {invoice.notes && (
            <div>
              <span className="font-bold text-slate-800 block mb-1">Notes:</span>
              <p className="whitespace-pre-wrap text-slate-600 leading-relaxed">{invoice.notes}</p>
            </div>
          )}
          {invoice.terms && (
            <div>
              <span className="font-bold text-slate-800 block mb-1">Terms & Conditions:</span>
              <p className="whitespace-pre-wrap text-slate-500 leading-relaxed">{invoice.terms}</p>
            </div>
          )}
        </div>

        {/* Signature Area */}
        {showSignature && (
          <div className="flex flex-col justify-end items-center sm:items-end text-center sm:text-right mt-4 sm:mt-0">
            <div className="w-44 border-b border-slate-400 pb-1 mb-2">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                Authorized Signature
              </span>
            </div>
            <p className="font-semibold text-slate-800 text-xs">
              {invoice.customization?.signatureText || seller.name || 'Authorized Signatory'}
            </p>
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <div className="mt-10 pt-4 border-t border-slate-100 text-center text-[10px] text-slate-400">
        Created free with <span className="font-semibold text-slate-600">QuickInvoice</span> • Zero setup invoicing
      </div>
    </div>
  );
};
