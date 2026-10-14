import React, { useRef } from 'react';
import { BusinessDetails } from '../../types/invoice';
import { Building2, Upload, Trash2 } from 'lucide-react';

interface BusinessSectionProps {
  business: BusinessDetails;
  onChange: (updated: BusinessDetails) => void;
}

export const BusinessSection: React.FC<BusinessSectionProps> = ({ business, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Logo image should be under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onChange({ ...business, logoUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white/95 rounded-2xl border border-orange-200/60 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-orange-100/70">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shadow-xs">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 font-display">Your Business Details (Bill From)</h3>
            <p className="text-xs text-stone-500">Your brand or freelance billing identity</p>
          </div>
        </div>

        {/* Logo preview / upload trigger */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleLogoUpload}
            accept="image/png, image/jpeg, image/svg+xml, image/webp"
            className="hidden"
          />
          {business.logoUrl ? (
            <div className="flex items-center gap-2">
              <img
                src={business.logoUrl}
                alt="Logo preview"
                className="w-8 h-8 rounded-lg object-contain border border-orange-200 p-0.5 bg-white"
              />
              <button
                type="button"
                onClick={() => onChange({ ...business, logoUrl: '' })}
                className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold p-1 cursor-pointer"
                title="Remove logo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs bg-orange-50 hover:bg-orange-100 text-orange-900 px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-bold border border-orange-200/70 transition cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-orange-600" />
              <span>Add Logo</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="sm:col-span-2">
          <label className="block font-semibold text-stone-700 mb-1">
            Business / Freelancer Name <span className="text-orange-600">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Amber Creative Studio or Sarah Connor"
            value={business.name}
            onChange={e => onChange({ ...business, name: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium transition"
          />
        </div>

        <div>
          <label className="block font-semibold text-stone-700 mb-1">
            Tax ID / GSTIN / PAN / VAT
          </label>
          <input
            type="text"
            placeholder="e.g. 29ABCDE1234F1Z5"
            value={business.taxId || ''}
            onChange={e => onChange({ ...business, taxId: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 uppercase transition font-mono"
          />
        </div>

        <div>
          <label className="block font-semibold text-stone-700 mb-1">Business Email</label>
          <input
            type="email"
            placeholder="billing@yourbusiness.com"
            value={business.email}
            onChange={e => onChange({ ...business, email: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
          />
        </div>

        <div>
          <label className="block font-semibold text-stone-700 mb-1">Phone Number</label>
          <input
            type="tel"
            placeholder="+91 98765 43210"
            value={business.phone}
            onChange={e => onChange({ ...business, phone: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
          />
        </div>

        <div>
          <label className="block font-semibold text-stone-700 mb-1">Website</label>
          <input
            type="text"
            placeholder="https://yourstudio.com"
            value={business.website || ''}
            onChange={e => onChange({ ...business, website: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block font-semibold text-stone-700 mb-1">Street Address</label>
          <input
            type="text"
            placeholder="Suite 201, Amber Arcade, 10th Cross"
            value={business.address}
            onChange={e => onChange({ ...business, address: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
          />
        </div>

        <div>
          <label className="block font-semibold text-stone-700 mb-1">City</label>
          <input
            type="text"
            placeholder="Bengaluru"
            value={business.city}
            onChange={e => onChange({ ...business, city: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
          />
        </div>

        <div>
          <label className="block font-semibold text-stone-700 mb-1">State / Province</label>
          <input
            type="text"
            placeholder="Karnataka"
            value={business.state}
            onChange={e => onChange({ ...business, state: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
          />
        </div>

        <div>
          <label className="block font-semibold text-stone-700 mb-1">Postal / ZIP Code</label>
          <input
            type="text"
            placeholder="560001"
            value={business.postalCode}
            onChange={e => onChange({ ...business, postalCode: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
          />
        </div>

        <div>
          <label className="block font-semibold text-stone-700 mb-1">Country</label>
          <input
            type="text"
            placeholder="India"
            value={business.country}
            onChange={e => onChange({ ...business, country: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
          />
        </div>
      </div>
    </div>
  );
};
