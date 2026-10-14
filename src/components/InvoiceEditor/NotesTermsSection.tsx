import React from 'react';
import { BankPaymentDetails } from '../../types/invoice';
import { Landmark, FileText, PenTool } from 'lucide-react';

interface NotesTermsSectionProps {
  paymentDetails: BankPaymentDetails;
  notes: string;
  terms: string;
  signatureText?: string;
  onUpdatePayment: (details: BankPaymentDetails) => void;
  onUpdateText: (fields: { notes?: string; terms?: string; signatureText?: string }) => void;
}

export const NotesTermsSection: React.FC<NotesTermsSectionProps> = ({
  paymentDetails,
  notes,
  terms,
  signatureText,
  onUpdatePayment,
  onUpdateText,
}) => {
  return (
    <div className="bg-white/95 rounded-2xl border border-orange-200/60 p-5 shadow-xs space-y-5">
      <div className="flex items-center gap-2.5 pb-3 border-b border-orange-100/70">
        <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shadow-xs">
          <Landmark className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-stone-900 font-display">Payment Instructions & Notes</h3>
          <p className="text-xs text-stone-500">Bank accounts, UPI ID, terms and signatory</p>
        </div>
      </div>

      {/* Payment details */}
      <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-orange-200/70 space-y-3 shadow-xs">
        <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider font-display">
          Direct Bank / UPI Settlement Details
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-stone-600 font-semibold mb-1">Bank Name</label>
            <input
              type="text"
              placeholder="e.g. HDFC Bank / Chase"
              value={paymentDetails.bankName}
              onChange={e => onUpdatePayment({ ...paymentDetails, bankName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-stone-600 font-semibold mb-1">Account Holder Name</label>
            <input
              type="text"
              placeholder="e.g. Acme Tech Pvt Ltd"
              value={paymentDetails.accountName}
              onChange={e => onUpdatePayment({ ...paymentDetails, accountName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-stone-600 font-semibold mb-1">Account Number</label>
            <input
              type="text"
              placeholder="e.g. 50200012345678"
              value={paymentDetails.accountNumber}
              onChange={e => onUpdatePayment({ ...paymentDetails, accountNumber: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 font-mono focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-stone-600 font-semibold mb-1">IFSC / Routing Code</label>
            <input
              type="text"
              placeholder="e.g. HDFC0001234"
              value={paymentDetails.ifscOrRouting}
              onChange={e => onUpdatePayment({ ...paymentDetails, ifscOrRouting: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 font-mono uppercase focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-stone-600 font-semibold mb-1">SWIFT / BIC (Optional)</label>
            <input
              type="text"
              placeholder="e.g. HDFCINBB"
              value={paymentDetails.swiftBic || ''}
              onChange={e => onUpdatePayment({ ...paymentDetails, swiftBic: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 font-mono uppercase focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-stone-600 font-semibold mb-1">UPI ID / Virtual Address</label>
            <input
              type="text"
              placeholder="e.g. yourname@upi"
              value={paymentDetails.upiId || ''}
              onChange={e => onUpdatePayment({ ...paymentDetails, upiId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 font-mono focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Notes and Terms */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block font-semibold text-stone-700 mb-1 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-orange-600" />
            Notes to Client
          </label>
          <textarea
            rows={3}
            placeholder="Thank you for your business! Please don't hesitate to reach out if you have any questions."
            value={notes}
            onChange={e => onUpdateText({ notes: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-stone-900 resize-none font-normal"
          />
        </div>

        <div>
          <label className="block font-semibold text-stone-700 mb-1 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-orange-600" />
            Terms & Conditions
          </label>
          <textarea
            rows={3}
            placeholder="1. Payment due within 15 days.\n2. Goods once delivered cannot be returned.\n3. Late fees of 1.5% apply."
            value={terms}
            onChange={e => onUpdateText({ terms: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-stone-900 resize-none font-normal"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block font-semibold text-stone-700 mb-1 flex items-center gap-1.5">
            <PenTool className="w-3.5 h-3.5 text-orange-600" />
            Signatory Label
          </label>
          <input
            type="text"
            placeholder="e.g. Authorized Signatory / Founder & CEO"
            value={signatureText || ''}
            onChange={e => onUpdateText({ signatureText: e.target.value })}
            className="w-full sm:w-1/2 px-3 py-2 rounded-xl border border-orange-200/80 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-stone-900"
          />
        </div>
      </div>
    </div>
  );
};
