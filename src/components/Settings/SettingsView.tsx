import React, { useState, useRef } from 'react';
import { AppSettings, BusinessDetails } from '../../types/invoice';
import { SUPPORTED_CURRENCIES } from '../../utils/currency';
import { exportBackupData, importBackupData, resetToSampleData } from '../../utils/storage';
import {
  Building2,
  DollarSign,
  FileText,
  Download,
  Upload,
  RotateCcw,
  Save,
  CheckCircle2,
  AlertTriangle,
  Landmark,
} from 'lucide-react';

interface SettingsViewProps {
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  onReloadAllData: () => void;
  onShowToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  onReloadAllData,
  onShowToast,
}) => {
  const [formData, setFormData] = useState<AppSettings>({ ...settings });
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdate = (patch: Partial<AppSettings>) => {
    setFormData(prev => ({ ...prev, ...patch }));
    setIsSaved(false);
  };

  const handleUpdateBusiness = (patch: Partial<BusinessDetails>) => {
    setFormData(prev => ({
      ...prev,
      defaultBusiness: { ...prev.defaultBusiness, ...patch },
    }));
    setIsSaved(false);
  };

  const handleCurrencyChange = (newCode: string) => {
    const selected = SUPPORTED_CURRENCIES.find(c => c.code === newCode);
    if (selected) {
      handleUpdate({
        defaultCurrency: selected.code,
        defaultCurrencySymbol: selected.symbol,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setIsSaved(true);
    onShowToast('success', 'Default settings saved successfully!');
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleExportBackup = () => {
    const jsonString = exportBackupData();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `QuickInvoice_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('success', 'Backup exported successfully!');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = importBackupData(reader.result as string);
      if (result.success) {
        onShowToast('success', `Backup restored successfully with ${result.count || 0} invoices.`);
        onReloadAllData();
      } else {
        onShowToast('error', result.error || 'Failed to restore backup.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetSamples = () => {
    if (confirm('Load sample invoices? This will populate the dashboard and invoice history with demo transactions.')) {
      resetToSampleData();
      onReloadAllData();
      onShowToast('info', 'Demo invoices loaded.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 font-display">
            Application Settings
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Pre-configure your business defaults, invoice sequences, taxes and data backups
          </p>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-orange-500/25 active:scale-[0.98] transition cursor-pointer"
        >
          {isSaved ? <CheckCircle2 className="w-4 h-4 text-amber-200" /> : <Save className="w-4 h-4" />}
          <span>{isSaved ? 'Settings Saved!' : 'Save Preferences'}</span>
        </button>
      </div>

      {/* 1. Default Business Details */}
      <div className="bg-white/95 rounded-2xl border border-orange-200/60 p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-orange-100/70">
          <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shadow-xs">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 font-display">Default Business Profile</h3>
            <p className="text-xs text-stone-500">Auto-filled whenever you create a new invoice</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="sm:col-span-2">
            <label className="block font-semibold text-stone-700 mb-1">
              Business / Freelancer Name *
            </label>
            <input
              type="text"
              required
              value={formData.defaultBusiness.name}
              onChange={e => handleUpdateBusiness({ name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium transition"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Tax ID / GSTIN / PAN / VAT
            </label>
            <input
              type="text"
              value={formData.defaultBusiness.taxId || ''}
              onChange={e => handleUpdateBusiness({ taxId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 uppercase focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-mono transition"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Email Address</label>
            <input
              type="email"
              value={formData.defaultBusiness.email}
              onChange={e => handleUpdateBusiness({ email: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={formData.defaultBusiness.phone}
              onChange={e => handleUpdateBusiness({ phone: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Website</label>
            <input
              type="text"
              value={formData.defaultBusiness.website || ''}
              onChange={e => handleUpdateBusiness({ website: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-stone-700 mb-1">Address</label>
            <input
              type="text"
              value={formData.defaultBusiness.address}
              onChange={e => handleUpdateBusiness({ address: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">City</label>
            <input
              type="text"
              value={formData.defaultBusiness.city}
              onChange={e => handleUpdateBusiness({ city: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">State / Province</label>
            <input
              type="text"
              value={formData.defaultBusiness.state}
              onChange={e => handleUpdateBusiness({ state: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Postal / ZIP Code</label>
            <input
              type="text"
              value={formData.defaultBusiness.postalCode}
              onChange={e => handleUpdateBusiness({ postalCode: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-mono transition"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Country</label>
            <input
              type="text"
              value={formData.defaultBusiness.country}
              onChange={e => handleUpdateBusiness({ country: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
            />
          </div>
        </div>
      </div>

      {/* 2. Numbering, Currency & Tax Defaults */}
      <div className="bg-white/95 rounded-2xl border border-orange-200/60 p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-orange-100/70">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-xs">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 font-display">Invoice Numbering & Financials</h3>
            <p className="text-xs text-stone-500">Prefixes, sequential numbering, and default currency</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Invoice Prefix</label>
            <input
              type="text"
              value={formData.invoicePrefix}
              onChange={e => handleUpdate({ invoicePrefix: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Next Invoice Sequence #</label>
            <input
              type="number"
              min="1"
              value={formData.nextInvoiceNumber}
              onChange={e => handleUpdate({ nextInvoiceNumber: parseInt(e.target.value, 10) || 1 })}
              className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Default Currency</label>
            <select
              value={formData.defaultCurrency}
              onChange={e => handleCurrencyChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition cursor-pointer"
            >
              {SUPPORTED_CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Default Tax Mode</label>
            <select
              value={formData.defaultTaxType}
              onChange={e => handleUpdate({ defaultTaxType: e.target.value as any })}
              className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition cursor-pointer"
            >
              <option value="none">No Tax</option>
              <option value="standard">Standard Tax / VAT</option>
              <option value="gst">Indian GST</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Default Bank & UPI Details */}
      <div className="bg-white/95 rounded-2xl border border-orange-200/60 p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-orange-100/70">
          <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shadow-xs">
            <Landmark className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 font-display">Default Bank & UPI Instructions</h3>
            <p className="text-xs text-stone-500">Printed automatically on new client invoices</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Bank Name</label>
            <input
              type="text"
              value={formData.defaultPaymentDetails.bankName}
              onChange={e =>
                handleUpdate({
                  defaultPaymentDetails: { ...formData.defaultPaymentDetails, bankName: e.target.value },
                })
              }
              className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Account Name</label>
            <input
              type="text"
              value={formData.defaultPaymentDetails.accountName}
              onChange={e =>
                handleUpdate({
                  defaultPaymentDetails: { ...formData.defaultPaymentDetails, accountName: e.target.value },
                })
              }
              className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Account Number</label>
            <input
              type="text"
              value={formData.defaultPaymentDetails.accountNumber}
              onChange={e =>
                handleUpdate({
                  defaultPaymentDetails: { ...formData.defaultPaymentDetails, accountNumber: e.target.value },
                })
              }
              className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">IFSC / Routing Code</label>
            <input
              type="text"
              value={formData.defaultPaymentDetails.ifscOrRouting}
              onChange={e =>
                handleUpdate({
                  defaultPaymentDetails: { ...formData.defaultPaymentDetails, ifscOrRouting: e.target.value },
                })
              }
              className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 font-mono uppercase"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">UPI ID</label>
            <input
              type="text"
              value={formData.defaultPaymentDetails.upiId || ''}
              onChange={e =>
                handleUpdate({
                  defaultPaymentDetails: { ...formData.defaultPaymentDetails, upiId: e.target.value },
                })
              }
              className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Payment Link (Optional)</label>
            <input
              type="text"
              value={formData.defaultPaymentDetails.paymentLink || ''}
              onChange={e =>
                handleUpdate({
                  defaultPaymentDetails: { ...formData.defaultPaymentDetails, paymentLink: e.target.value },
                })
              }
              className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900"
            />
          </div>
        </div>
      </div>

      {/* 4. Default Terms & Notes */}
      <div className="bg-white/95 rounded-2xl border border-orange-200/60 p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-orange-100/70">
          <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shadow-xs">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 font-display">Default Notes & Payment Terms</h3>
            <p className="text-xs text-stone-500">Appended to the bottom of newly created invoices</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Default Notes</label>
            <textarea
              rows={3}
              value={formData.defaultNotes}
              onChange={e => handleUpdate({ defaultNotes: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 resize-none font-normal"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Default Terms & Conditions</label>
            <textarea
              rows={3}
              value={formData.defaultTerms}
              onChange={e => handleUpdate({ defaultTerms: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-orange-200/80 bg-white text-stone-900 resize-none font-normal"
            />
          </div>
        </div>
      </div>

      {/* 5. Backup, Restore & Data Storage Management */}
      <div className="bg-white/95 rounded-2xl border border-orange-200/60 p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-orange-100/70">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-xs">
            <RotateCcw className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 font-display">Backup, Restore & Local Storage</h3>
            <p className="text-xs text-stone-500">
              QuickInvoice stores all data directly in your browser's private local storage.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-amber-950 text-xs flex items-start gap-3 shadow-xs">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-medium">
            Since no remote account registration is required, clearing your browser history or cache may erase saved
            invoices. Keep a periodic JSON backup file downloaded to restore whenever needed.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleExportBackup}
            className="px-4.5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-2 transition shadow-sm active:scale-[0.98] cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Backup (JSON)</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportFile}
            accept=".json,application/json"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4.5 py-2.5 rounded-xl border border-orange-200/80 bg-white hover:bg-orange-50 text-stone-800 text-xs font-bold flex items-center gap-2 transition cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-orange-600" />
            <span>Import Backup (JSON)</span>
          </button>

          <button
            type="button"
            onClick={handleResetSamples}
            className="px-4 py-2.5 rounded-xl border border-orange-200 bg-orange-100/70 hover:bg-orange-100 text-orange-950 text-xs font-bold flex items-center gap-2 transition ml-auto cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Load Demo Invoices</span>
          </button>
        </div>
      </div>
    </form>
  );
};
