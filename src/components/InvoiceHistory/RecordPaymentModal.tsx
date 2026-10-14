import React, { useState } from 'react';
import { Invoice, PaymentRecord } from '../../types/invoice';
import { calculateInvoice, getComputedInvoiceStatus } from '../../utils/calculations';
import { formatCurrency } from '../../utils/currency';
import { X, CreditCard, Trash2, Plus } from 'lucide-react';

interface RecordPaymentModalProps {
  invoice: Invoice;
  isOpen: boolean;
  onClose: () => void;
  onSavePayments: (updatedInvoice: Invoice) => void;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  invoice,
  isOpen,
  onClose,
  onSavePayments,
}) => {
  if (!isOpen) return null;

  const calc = calculateInvoice(invoice);

  const [amount, setAmount] = useState<string>(
    calc.outstandingBalance > 0 ? String(calc.outstandingBalance) : ''
  );
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [method, setMethod] = useState<PaymentRecord['method']>('bank_transfer');
  const [reference, setReference] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid payment amount greater than zero.');
      return;
    }

    const newPayment: PaymentRecord = {
      id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      amount: parsedAmount,
      date: date || new Date().toISOString().split('T')[0],
      method,
      reference: reference.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    const nextPayments = [...(invoice.payments || []), newPayment];
    const updatedInvoice: Invoice = {
      ...invoice,
      payments: nextPayments,
      updatedAt: new Date().toISOString(),
    };
    updatedInvoice.status = getComputedInvoiceStatus(updatedInvoice);

    onSavePayments(updatedInvoice);
    onClose();
  };

  const handleRemovePayment = (paymentId: string) => {
    const nextPayments = (invoice.payments || []).filter(p => p.id !== paymentId);
    const updatedInvoice: Invoice = {
      ...invoice,
      payments: nextPayments,
      updatedAt: new Date().toISOString(),
    };
    updatedInvoice.status = getComputedInvoiceStatus(updatedInvoice);
    onSavePayments(updatedInvoice);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-orange-200/80 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-orange-100 bg-orange-50/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shadow-xs">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 font-display">Record Client Payment</h3>
              <p className="text-xs text-stone-500">Invoice #{invoice.invoiceNumber}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Summary Box */}
          <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-orange-200/70 grid grid-cols-3 gap-2 text-center text-xs shadow-xs">
            <div>
              <span className="text-stone-400 block text-[11px] font-medium">Total Invoice</span>
              <span className="font-bold text-stone-900 font-mono text-sm mt-0.5 block">
                {formatCurrency(calc.grandTotal, invoice.currency, invoice.currencySymbol)}
              </span>
            </div>
            <div>
              <span className="text-stone-400 block text-[11px] font-medium">Total Received</span>
              <span className="font-bold text-emerald-700 font-mono text-sm mt-0.5 block">
                {formatCurrency(calc.totalPaid, invoice.currency, invoice.currencySymbol)}
              </span>
            </div>
            <div>
              <span className="text-stone-400 block text-[11px] font-medium">Balance Due</span>
              <span className="font-bold text-amber-700 font-mono text-sm mt-0.5 block">
                {formatCurrency(calc.outstandingBalance, invoice.currency, invoice.currencySymbol)}
              </span>
            </div>
          </div>

          {/* New Payment Form */}
          <form onSubmit={handleAddPayment} className="space-y-3.5 text-xs">
            <h4 className="font-bold text-stone-800 text-xs uppercase tracking-wider font-display">
              Add New Transaction
            </h4>

            {error && (
              <p className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-semibold">
                {error}
              </p>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Payment Amount ({invoice.currencySymbol}) *
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  required
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Payment Date *</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Payment Method</label>
                <select
                  value={method}
                  onChange={e => setMethod(e.target.value as PaymentRecord['method'])}
                  className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer"
                >
                  <option value="bank_transfer">Bank Transfer / NEFT / IMPS</option>
                  <option value="upi">UPI / QR Code</option>
                  <option value="cash">Cash</option>
                  <option value="credit_card">Credit / Debit Card</option>
                  <option value="cheque">Cheque</option>
                  <option value="paypal">PayPal</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Transaction Ref / UTR</label>
                <input
                  type="text"
                  placeholder="e.g. UTR-98273618"
                  value={reference}
                  onChange={e => setReference(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Notes (Optional)</label>
              <input
                type="text"
                placeholder="e.g. 50% advance milestone deposit"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20 active:scale-[0.98] transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Save Payment</span>
              </button>
            </div>
          </form>

          {/* Existing Payments List */}
          {invoice.payments && invoice.payments.length > 0 && (
            <div className="pt-4 border-t border-orange-100 space-y-2.5">
              <h4 className="font-bold text-stone-800 text-xs uppercase tracking-wider font-display">
                Recorded Payments ({invoice.payments.length})
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {invoice.payments.map((p, idx) => (
                  <div
                    key={p.id || idx}
                    className="p-3 rounded-xl border border-orange-200/70 bg-[#FFFDF9] flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 font-mono">
                          {formatCurrency(p.amount, invoice.currency, invoice.currencySymbol)}
                        </span>
                        <span className="text-stone-300">•</span>
                        <span className="text-stone-700 capitalize font-medium">{p.method.replace('_', ' ')}</span>
                      </div>
                      <p className="text-[11px] text-stone-400 mt-0.5 font-mono">
                        {p.date} {p.reference ? `• Ref: ${p.reference}` : ''}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePayment(p.id)}
                      className="text-rose-500 hover:text-rose-700 p-1 rounded-lg cursor-pointer"
                      title="Delete payment entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
