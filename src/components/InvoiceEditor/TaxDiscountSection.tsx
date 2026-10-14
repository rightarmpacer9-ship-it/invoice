import React from 'react';
import { TaxType, GSTType, DiscountType } from '../../types/invoice';
import { Percent, Receipt, Truck } from 'lucide-react';

interface TaxDiscountSectionProps {
  discountType: DiscountType;
  discountValue: number;
  taxType: TaxType;
  standardTaxRate: number;
  standardTaxLabel: string;
  gstType: GSTType;
  gstRate: number;
  shippingOrCharges: number;
  chargesLabel: string;
  currencySymbol: string;
  onUpdate: (fields: any) => void;
}

const COMMON_GST_RATES = [0, 5, 12, 18, 28];

export const TaxDiscountSection: React.FC<TaxDiscountSectionProps> = ({
  discountType,
  discountValue,
  taxType,
  standardTaxRate,
  standardTaxLabel,
  gstType,
  gstRate,
  shippingOrCharges,
  chargesLabel,
  currencySymbol,
  onUpdate,
}) => {
  return (
    <div className="bg-white/95 rounded-2xl border border-orange-200/60 p-5 shadow-xs space-y-5">
      <div className="flex items-center gap-2.5 pb-3 border-b border-orange-100/70">
        <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-xs">
          <Receipt className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-stone-900 font-display">Taxes, Discounts & Extra Charges</h3>
          <p className="text-xs text-stone-500">Configure tax rates, GST splits, and billing adjustments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
        {/* 1. Invoice-level Discount */}
        <div className="space-y-3 p-4 rounded-2xl bg-[#FFFDF9] border border-orange-200/70 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-stone-800 flex items-center gap-1.5 font-display">
              <Percent className="w-3.5 h-3.5 text-orange-600" />
              Invoice Discount
            </span>
            <div className="inline-flex rounded-xl border border-orange-200/80 bg-white p-0.5">
              <button
                type="button"
                onClick={() => onUpdate({ discountType: 'percentage' })}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  discountType === 'percentage'
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                % Percent
              </button>
              <button
                type="button"
                onClick={() => onUpdate({ discountType: 'fixed' })}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  discountType === 'fixed'
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Fixed ({currencySymbol})
              </button>
            </div>
          </div>

          <div>
            <label className="block text-stone-600 font-semibold mb-1">
              {discountType === 'percentage' ? 'Discount Percentage (%)' : `Discount Amount (${currencySymbol})`}
            </label>
            <input
              type="number"
              min="0"
              max={discountType === 'percentage' ? '100' : undefined}
              step="any"
              placeholder="0"
              value={discountValue || ''}
              onChange={e => onUpdate({ discountValue: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-1.5 rounded-xl border border-orange-200/80 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-stone-900 font-mono transition"
            />
          </div>
        </div>

        {/* 2. Tax Settings */}
        <div className="space-y-3 p-4 rounded-2xl bg-[#FFFDF9] border border-orange-200/70 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-stone-800 font-display">Tax Mode</span>
            <select
              value={taxType}
              onChange={e => onUpdate({ taxType: e.target.value as TaxType })}
              className="px-2.5 py-1 rounded-xl border border-orange-200/80 bg-white text-stone-900 text-[11px] font-bold cursor-pointer"
            >
              <option value="none">No Tax (0%)</option>
              <option value="standard">Standard Tax / VAT</option>
              <option value="gst">Indian GST (CGST/SGST/IGST)</option>
            </select>
          </div>

          {taxType === 'standard' && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Tax Label</label>
                  <input
                    type="text"
                    placeholder="VAT / Tax"
                    value={standardTaxLabel}
                    onChange={e => onUpdate({ standardTaxLabel: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-orange-200/80 bg-white text-stone-900 text-xs focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Rate (%)</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="10"
                    value={standardTaxRate || ''}
                    onChange={e => onUpdate({ standardTaxRate: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-orange-200/80 bg-white text-stone-900 font-mono text-xs focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>
            </div>
          )}

          {taxType === 'gst' && (
            <div className="space-y-2.5">
              <div>
                <label className="block text-stone-600 font-semibold mb-1">GST Transaction Mode</label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => onUpdate({ gstType: 'cgst_sgst' })}
                    className={`py-1.5 px-2 rounded-xl border text-[11px] font-bold text-center transition cursor-pointer ${
                      gstType === 'cgst_sgst'
                        ? 'border-orange-600 bg-orange-100/80 text-orange-950 shadow-xs'
                        : 'border-orange-200/80 bg-white text-stone-600 hover:bg-orange-50/60'
                    }`}
                  >
                    Intra-State (CGST+SGST)
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdate({ gstType: 'igst' })}
                    className={`py-1.5 px-2 rounded-xl border text-[11px] font-bold text-center transition cursor-pointer ${
                      gstType === 'igst'
                        ? 'border-orange-600 bg-orange-100/80 text-orange-950 shadow-xs'
                        : 'border-orange-200/80 bg-white text-stone-600 hover:bg-orange-50/60'
                    }`}
                  >
                    Inter-State (IGST)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">GST Slab Rate</label>
                <div className="flex items-center gap-1 mb-1.5 flex-wrap">
                  {COMMON_GST_RATES.map(rate => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => onUpdate({ gstRate: rate })}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                        gstRate === rate
                          ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-xs'
                          : 'bg-white border border-orange-200/80 text-stone-700 hover:bg-orange-50/80'
                      }`}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="Custom GST %"
                  value={gstRate || ''}
                  onChange={e => onUpdate({ gstRate: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-orange-200/80 bg-white text-stone-900 font-mono text-xs focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <p className="text-[11px] text-amber-900/80 font-medium">
                {gstType === 'cgst_sgst'
                  ? `CGST: ${gstRate / 2}% + SGST: ${gstRate / 2}% will be billed.`
                  : `Integrated GST (IGST) at ${gstRate}% will be billed.`}
              </p>
            </div>
          )}

          {taxType === 'none' && (
            <p className="text-stone-400 italic text-[11px] pt-2">
              No taxes will be applied to this invoice.
            </p>
          )}
        </div>

        {/* 3. Additional Charges */}
        <div className="space-y-3 p-4 rounded-2xl bg-[#FFFDF9] border border-orange-200/70 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-stone-800 flex items-center gap-1.5 font-display">
              <Truck className="w-3.5 h-3.5 text-orange-600" />
              Additional Charges
            </span>
          </div>

          <div>
            <label className="block text-stone-600 font-semibold mb-1">Charge Description</label>
            <input
              type="text"
              placeholder="e.g. Shipping / Packaging / Delivery"
              value={chargesLabel}
              onChange={e => onUpdate({ chargesLabel: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-xl border border-orange-200/80 bg-white text-stone-900 text-xs focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-stone-600 font-semibold mb-1">Charge Amount ({currencySymbol})</label>
            <input
              type="number"
              min="0"
              step="any"
              placeholder="0.00"
              value={shippingOrCharges || ''}
              onChange={e => onUpdate({ shippingOrCharges: parseFloat(e.target.value) || 0 })}
              className="w-full px-2.5 py-1.5 rounded-xl border border-orange-200/80 bg-white text-stone-900 font-mono text-xs focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
