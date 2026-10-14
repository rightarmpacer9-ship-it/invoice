import React from 'react';
import { LineItem } from '../../types/invoice';
import { formatCurrency } from '../../utils/currency';
import { calculateLineItemTotal } from '../../utils/calculations';
import { Plus, Trash2, Copy, Layers } from 'lucide-react';

interface LineItemsSectionProps {
  items: LineItem[];
  currency: string;
  currencySymbol: string;
  showHsnSac: boolean;
  onChange: (updatedItems: LineItem[]) => void;
}

export const LineItemsSection: React.FC<LineItemsSectionProps> = ({
  items,
  currency,
  currencySymbol,
  showHsnSac,
  onChange,
}) => {
  const handleAddItem = () => {
    const newItem: LineItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      description: '',
      hsnSac: '',
      quantity: 1,
      unitPrice: 0,
      discountRate: 0,
    };
    onChange([...items, newItem]);
  };

  const handleDuplicateItem = (index: number) => {
    const source = items[index];
    const duplicated: LineItem = {
      ...source,
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    const next = [...items];
    next.splice(index + 1, 0, duplicated);
    onChange(next);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) {
      onChange([
        {
          id: `item_${Date.now()}`,
          description: '',
          hsnSac: '',
          quantity: 1,
          unitPrice: 0,
          discountRate: 0,
        },
      ]);
      return;
    }
    const next = items.filter((_, i) => i !== index);
    onChange(next);
  };

  const handleFieldChange = (index: number, field: keyof LineItem, value: any) => {
    const next = [...items];
    next[index] = {
      ...next[index],
      [field]: value,
    };
    onChange(next);
  };

  return (
    <div className="bg-white/95 rounded-2xl border border-orange-200/60 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-orange-100/70">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shadow-xs">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 font-display">Products & Services</h3>
            <p className="text-xs text-stone-500">Itemize deliverables, goods, and consulting services</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddItem}
          className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm transition active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Item</span>
        </button>
      </div>

      {/* Items list */}
      <div className="space-y-3">
        {items.map((item, index) => {
          const lineTotal = calculateLineItemTotal(item);

          return (
            <div
              key={item.id}
              className="p-4 rounded-2xl border border-orange-200/70 bg-[#FFFDF9] hover:border-orange-300 transition-all space-y-3 shadow-xs"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
                {/* Description */}
                <div className={showHsnSac ? 'md:col-span-5' : 'md:col-span-6'}>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Item Description <span className="text-orange-600">*</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe product, service, or deliverable..."
                    value={item.description}
                    onChange={e => handleFieldChange(index, 'description', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-orange-200/80 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-stone-900 resize-none font-normal transition"
                  />
                </div>

                {/* HSN / SAC (if enabled) */}
                {showHsnSac && (
                  <div className="md:col-span-2">
                    <label className="block font-semibold text-stone-700 mb-1">HSN / SAC</label>
                    <input
                      type="text"
                      placeholder="e.g. 998314"
                      value={item.hsnSac || ''}
                      onChange={e => handleFieldChange(index, 'hsnSac', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-orange-200/80 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-stone-900 font-mono transition"
                    />
                  </div>
                )}

                {/* Quantity */}
                <div className="md:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={item.quantity}
                    onChange={e => handleFieldChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-orange-200/80 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-stone-900 font-mono transition"
                  />
                </div>

                {/* Unit Price */}
                <div className="md:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">Unit Price</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="0.00"
                    value={item.unitPrice}
                    onChange={e => handleFieldChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-orange-200/80 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-stone-900 font-mono transition"
                  />
                </div>

                {/* Line Discount % */}
                <div className="md:col-span-1">
                  <label className="block font-semibold text-stone-700 mb-1">Disc %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0"
                    value={item.discountRate || ''}
                    onChange={e => handleFieldChange(index, 'discountRate', parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 rounded-xl border border-orange-200/80 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-stone-900 font-mono transition"
                  />
                </div>
              </div>

              {/* Bottom row: Line total & actions */}
              <div className="flex items-center justify-between pt-2 border-t border-orange-100/70 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDuplicateItem(index)}
                    className="text-stone-600 hover:text-orange-900 p-1.5 rounded-lg hover:bg-orange-100/70 flex items-center gap-1 font-semibold transition cursor-pointer"
                    title="Duplicate item"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Duplicate</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="text-rose-600 hover:text-rose-800 p-1.5 rounded-lg hover:bg-rose-50 flex items-center gap-1 font-semibold transition cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-stone-500 font-medium">Line Amount:</span>
                  <span className="font-bold text-stone-900 font-mono text-sm">
                    {formatCurrency(lineTotal, currency, currencySymbol)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleAddItem}
        className="w-full py-3 border-2 border-dashed border-orange-200 hover:border-orange-400 hover:bg-orange-50/40 text-stone-600 hover:text-orange-950 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
      >
        <Plus className="w-4 h-4 text-orange-600" />
        <span>Add Another Line Item</span>
      </button>
    </div>
  );
};
