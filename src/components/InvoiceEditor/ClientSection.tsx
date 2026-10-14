import React from 'react';
import { ClientDetails } from '../../types/invoice';
import { UserCheck } from 'lucide-react';

interface ClientSectionProps {
  client: ClientDetails;
  onChange: (updated: ClientDetails) => void;
}

export const ClientSection: React.FC<ClientSectionProps> = ({ client, onChange }) => {
  return (
    <div className="bg-white/95 rounded-2xl border border-orange-200/60 p-5 shadow-xs space-y-4">
      <div className="flex items-center gap-2.5 pb-3 border-b border-orange-100/70">
        <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-xs">
          <UserCheck className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-stone-900 font-display">Client Details (Bill To)</h3>
          <p className="text-xs text-stone-500">Recipient contact and business information</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block font-semibold text-stone-700 mb-1">
            Client Contact Name <span className="text-orange-600">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. John Doe or Priya Sharma"
            value={client.name}
            onChange={e => onChange({ ...client, name: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium transition"
          />
        </div>

        <div>
          <label className="block font-semibold text-stone-700 mb-1">Company / Organization</label>
          <input
            type="text"
            placeholder="e.g. Zenith Retail Solutions Pvt Ltd"
            value={client.companyName || ''}
            onChange={e => onChange({ ...client, companyName: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
          />
        </div>

        <div>
          <label className="block font-semibold text-stone-700 mb-1">Client Tax ID / GSTIN</label>
          <input
            type="text"
            placeholder="e.g. 29ZZZZZ9876A1Z2"
            value={client.taxId || ''}
            onChange={e => onChange({ ...client, taxId: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 uppercase transition font-mono"
          />
        </div>

        <div>
          <label className="block font-semibold text-stone-700 mb-1">Client Email</label>
          <input
            type="email"
            placeholder="client@company.com"
            value={client.email}
            onChange={e => onChange({ ...client, email: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
          />
        </div>

        <div>
          <label className="block font-semibold text-stone-700 mb-1">Client Phone</label>
          <input
            type="tel"
            placeholder="+91 91234 56789"
            value={client.phone}
            onChange={e => onChange({ ...client, phone: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block font-semibold text-stone-700 mb-1">Billing Street Address</label>
          <input
            type="text"
            placeholder="Plot 42, Outer Ring Road, Tech Park"
            value={client.address}
            onChange={e => onChange({ ...client, address: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
          />
        </div>

        <div>
          <label className="block font-semibold text-stone-700 mb-1">City</label>
          <input
            type="text"
            placeholder="Bengaluru"
            value={client.city}
            onChange={e => onChange({ ...client, city: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
          />
        </div>

        <div>
          <label className="block font-semibold text-stone-700 mb-1">State / Region</label>
          <input
            type="text"
            placeholder="Karnataka"
            value={client.state}
            onChange={e => onChange({ ...client, state: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
          />
        </div>

        <div>
          <label className="block font-semibold text-stone-700 mb-1">Postal / ZIP Code</label>
          <input
            type="text"
            placeholder="560103"
            value={client.postalCode}
            onChange={e => onChange({ ...client, postalCode: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition font-mono"
          />
        </div>

        <div>
          <label className="block font-semibold text-stone-700 mb-1">Country</label>
          <input
            type="text"
            placeholder="India"
            value={client.country}
            onChange={e => onChange({ ...client, country: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
          />
        </div>
      </div>
    </div>
  );
};
