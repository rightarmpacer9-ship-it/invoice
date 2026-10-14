import React from 'react';
import { AccentColor, InvoiceCustomization } from '../../types/invoice';
import { Palette, Check } from 'lucide-react';

interface TemplateSelectorProps {
  customization: InvoiceCustomization;
  onChange: (updated: InvoiceCustomization) => void;
}

const ACCENT_COLORS: { id: AccentColor; label: string; bgClass: string }[] = [
  { id: 'terracotta', label: 'Burnt Terracotta', bgClass: 'bg-orange-600' },
  { id: 'amber', label: 'Golden Honey', bgClass: 'bg-amber-500' },
  { id: 'peach', label: 'Warm Peach & Coral', bgClass: 'bg-rose-500' },
  { id: 'espresso', label: 'Warm Espresso', bgClass: 'bg-stone-900' },
  { id: 'sage', label: 'Earthy Sage', bgClass: 'bg-emerald-700' },
  { id: 'rosewood', label: 'Deep Rosewood', bgClass: 'bg-rose-800' },
  { id: 'indigo', label: 'Classic Indigo', bgClass: 'bg-indigo-600' },
  { id: 'slate', label: 'Cool Slate', bgClass: 'bg-slate-700' },
];

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ customization, onChange }) => {
  return (
    <div className="bg-white/95 rounded-2xl border border-orange-200/60 p-5 shadow-xs space-y-4">
      <div className="flex items-center gap-2 text-sm font-bold text-stone-900 font-display">
        <Palette className="w-4 h-4 text-orange-600" />
        <span>Invoice Appearance & Theme</span>
      </div>

      {/* Accent Colors */}
      <div>
        <label className="text-xs font-semibold text-stone-600 block mb-2.5">
          Accent Palette Selection
        </label>
        <div className="flex items-center gap-2.5 flex-wrap">
          {ACCENT_COLORS.map(c => {
            const isSelected = customization.accentColor === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onChange({ ...customization, accentColor: c.id })}
                className={`w-7 h-7 rounded-full ${c.bgClass} flex items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? 'ring-3 ring-offset-2 ring-orange-500 scale-110 shadow-sm'
                    : 'hover:scale-105 opacity-90 hover:opacity-100'
                }`}
                title={c.label}
              >
                {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Display Options */}
      <div className="pt-3 border-t border-orange-100/70 grid grid-cols-2 gap-2.5 text-xs">
        <label className="flex items-center gap-2 cursor-pointer text-stone-700 font-medium">
          <input
            type="checkbox"
            checked={customization.showHsnSac}
            onChange={e => onChange({ ...customization, showHsnSac: e.target.checked })}
            className="rounded-md border-orange-300 text-orange-600 focus:ring-orange-500"
          />
          <span>HSN / SAC Column</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-stone-700 font-medium">
          <input
            type="checkbox"
            checked={customization.showPaymentDetails}
            onChange={e => onChange({ ...customization, showPaymentDetails: e.target.checked })}
            className="rounded-md border-orange-300 text-orange-600 focus:ring-orange-500"
          />
          <span>Bank & UPI Details</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-stone-700 font-medium">
          <input
            type="checkbox"
            checked={customization.showDueDate}
            onChange={e => onChange({ ...customization, showDueDate: e.target.checked })}
            className="rounded-md border-orange-300 text-orange-600 focus:ring-orange-500"
          />
          <span>Due Date</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-stone-700 font-medium">
          <input
            type="checkbox"
            checked={customization.showSignature}
            onChange={e => onChange({ ...customization, showSignature: e.target.checked })}
            className="rounded-md border-orange-300 text-orange-600 focus:ring-orange-500"
          />
          <span>Signature Area</span>
        </label>
      </div>
    </div>
  );
};
