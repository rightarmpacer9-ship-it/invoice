import React from 'react';
import { SUPPORTED_CURRENCIES } from '../../utils/currency';
import { RefreshCw, Hash } from 'lucide-react';
import { getNextInvoiceNumber } from '../../utils/storage';

interface InvoiceMetaSectionProps {
  invoiceNumber: string;
  poNumber?: string;
  date: string;
  dueDate: string;
  currency: string;
  onUpdate: (fields: {
    invoiceNumber?: string;
    poNumber?: string;
    date?: string;
    dueDate?: string;
    currency?: string;
    currencySymbol?: string;
  }) => void;
}

export const InvoiceMetaSection: React.FC<InvoiceMetaSectionProps> = ({
  invoiceNumber,
  poNumber = '',
  date,
  dueDate,
  currency,
  onUpdate,
}) => {
  const handleCurrencyChange = (newCode: string) => {
    const selected = SUPPORTED_CURRENCIES.find(c => c.code === newCode);
    if (selected) {
      onUpdate({ currency: selected.code, currencySymbol: selected.symbol });
    }
  };

  const handleDueDatePreset = (daysToAdd: number) => {
    const baseDate = date ? new Date(date) : new Date();
    baseDate.setDate(baseDate.getDate() + daysToAdd);
    onUpdate({ dueDate: baseDate.toISOString().split('T')[0] });
  };

  const handleRegenerateNumber = () => {
    const nextNum = getNextInvoiceNumber();
    onUpdate({ invoiceNumber: nextNum });
  };

  return (
    <div className="bg-white/95 rounded-2xl border border-orange-200/60 p-5 shadow-xs space-y-4">
      <div className="flex items-center gap-2.5 pb-3 border-b border-orange-100/70">
        <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shadow-xs">
          <Hash className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-stone-900 font-display">Invoice Reference & Timeline</h3>
          <p className="text-xs text-stone-500">Identifiers, schedule, and transaction currency</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Invoice Number */}
        <div>
          <label className="block font-semibold text-stone-700 mb-1">
            Invoice Number <span className="text-orange-600">*</span>
          </label>
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              required
              value={invoiceNumber}
              onChange={e => onUpdate({ invoiceNumber: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-mono font-bold text-stone-900 transition"
            />
            <button
              type="button"
              onClick={handleRegenerateNumber}
              className="p-2 border border-orange-200/80 bg-orange-50 hover:bg-orange-100 text-orange-800 rounded-xl shrink-0 transition cursor-pointer"
              title="Generate new invoice number"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* PO Number */}
        <div>
          <label className="block font-semibold text-stone-700 mb-1">Purchase Order (P.O. #)</label>
          <input
            type="text"
            placeholder="e.g. PO-8821 (optional)"
            value={poNumber}
            onChange={e => onUpdate({ poNumber: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-stone-900 transition"
          />
        </div>

        {/* Invoice Date */}
        <div>
          <label className="block font-semibold text-stone-700 mb-1">
            Invoice Date <span className="text-orange-600">*</span>
          </label>
          <input
            type="date"
            required
            value={date}
            onChange={e => onUpdate({ date: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-stone-900 transition font-mono"
          />
        </div>

        {/* Currency */}
        <div>
          <label className="block font-semibold text-stone-700 mb-1">Currency</label>
          <select
            value={currency}
            onChange={e => handleCurrencyChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-stone-900 font-semibold transition cursor-pointer"
          >
            {SUPPORTED_CURRENCIES.map(curr => (
              <option key={curr.code} value={curr.code}>
                {curr.label}
              </option>
            ))}
          </select>
        </div>

        {/* Due Date with Presets */}
        <div className="sm:col-span-2 lg:col-span-4 pt-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
            <label className="font-semibold text-stone-700">Payment Due Date</label>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-stone-400 font-medium">Presets:</span>
              <button
                type="button"
                onClick={() => handleDueDatePreset(0)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-orange-50/80 hover:bg-orange-100 text-orange-900 border border-orange-200/60 font-semibold transition cursor-pointer"
              >
                On Receipt
              </button>
              <button
                type="button"
                onClick={() => handleDueDatePreset(7)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-orange-50/80 hover:bg-orange-100 text-orange-900 border border-orange-200/60 font-semibold transition cursor-pointer"
              >
                Net 7
              </button>
              <button
                type="button"
                onClick={() => handleDueDatePreset(15)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-orange-500 text-white font-bold shadow-xs transition cursor-pointer"
              >
                Net 15
              </button>
              <button
                type="button"
                onClick={() => handleDueDatePreset(30)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-orange-50/80 hover:bg-orange-100 text-orange-900 border border-orange-200/60 font-semibold transition cursor-pointer"
              >
                Net 30
              </button>
              <button
                type="button"
                onClick={() => handleDueDatePreset(60)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-orange-50/80 hover:bg-orange-100 text-orange-900 border border-orange-200/60 font-semibold transition cursor-pointer"
              >
                Net 60
              </button>
            </div>
          </div>
          <input
            type="date"
            value={dueDate}
            onChange={e => onUpdate({ dueDate: e.target.value })}
            className="w-full sm:w-1/2 px-3 py-2 rounded-xl border border-orange-200/80 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-stone-900 transition font-mono"
          />
        </div>
      </div>
    </div>
  );
};
