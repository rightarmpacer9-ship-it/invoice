import React, { useState, useEffect } from 'react';
import { Invoice, AppSettings } from './types/invoice';
import {
  getInvoices,
  saveInvoice,
  deleteInvoice,
  getSettings,
  saveSettings,
  createBlankInvoice,
  getNextInvoiceNumber,
  resetToSampleData,
} from './utils/storage';
import { Navbar, NavTab } from './components/Navbar';
import { DashboardView } from './components/Dashboard/DashboardView';
import { InvoiceEditor } from './components/InvoiceEditor/InvoiceEditor';
import { InvoiceHistoryView } from './components/InvoiceHistory/InvoiceHistoryView';
import { SettingsView } from './components/Settings/SettingsView';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { ShieldCheck, Heart, Sparkles } from 'lucide-react';

export default function App() {
  const [settings, setSettings] = useState<AppSettings>(() => getSettings());
  const [invoices, setInvoices] = useState<Invoice[]>(() => getInvoices());
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [currentInvoice, setCurrentInvoice] = useState<Invoice>(() => createBlankInvoice(settings));
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast notification helper
  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Create new blank invoice
  const handleNewInvoice = () => {
    const blank = createBlankInvoice(settings);
    setCurrentInvoice(blank);
    setCurrentTab('editor');
    addToast('info', `Drafting new invoice #${blank.invoiceNumber}`);
  };

  // Edit an existing invoice
  const handleEditInvoice = (inv: Invoice) => {
    setCurrentInvoice(JSON.parse(JSON.stringify(inv)));
    setCurrentTab('editor');
  };

  // Duplicate an invoice
  const handleDuplicateInvoice = (source: Invoice) => {
    const nextNumber = getNextInvoiceNumber(settings);
    const today = new Date().toISOString().split('T')[0];
    const dueDateObj = new Date();
    dueDateObj.setDate(dueDateObj.getDate() + 15);

    const duplicated: Invoice = {
      ...JSON.parse(JSON.stringify(source)),
      id: `inv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      invoiceNumber: nextNumber,
      date: today,
      dueDate: dueDateObj.toISOString().split('T')[0],
      status: 'unpaid',
      payments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveInvoice(duplicated);
    setInvoices(getInvoices());
    setCurrentInvoice(duplicated);
    setCurrentTab('editor');
    addToast('success', `Duplicated as #${duplicated.invoiceNumber}`);
  };

  // Save invoice (from editor)
  const handleSaveInvoice = (savedInvoice: Invoice) => {
    saveInvoice(savedInvoice);
    setInvoices(getInvoices());
    setSettings(getSettings());
    setCurrentInvoice(savedInvoice);
  };

  // Delete invoice
  const handleDeleteInvoice = (id: string) => {
    deleteInvoice(id);
    setInvoices(getInvoices());
  };

  // Update invoice (e.g. from payment modal in history)
  const handleUpdateInvoice = (updated: Invoice) => {
    saveInvoice(updated);
    setInvoices(getInvoices());
  };

  // Save Settings
  const handleSaveSettings = (newSettings: AppSettings) => {
    saveSettings(newSettings);
    setSettings(newSettings);
  };

  // Reload all data after import or demo reset
  const handleReloadAllData = () => {
    const freshInvoices = getInvoices();
    const freshSettings = getSettings();
    setInvoices(freshInvoices);
    setSettings(freshSettings);
    if (freshInvoices.length > 0) {
      setCurrentInvoice(freshInvoices[0]);
    } else {
      setCurrentInvoice(createBlankInvoice(freshSettings));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-stone-800">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onNewInvoice={handleNewInvoice}
        invoiceCount={invoices.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === 'dashboard' && (
          <DashboardView
            invoices={invoices}
            onNewInvoice={handleNewInvoice}
            onEditInvoice={handleEditInvoice}
            onDuplicateInvoice={handleDuplicateInvoice}
            onViewInvoice={handleEditInvoice}
            onRecordPayment={handleEditInvoice}
            onGoToHistory={() => setCurrentTab('history')}
            onLoadSamples={() => {
              resetToSampleData();
              handleReloadAllData();
              addToast('info', 'Loaded demo sample invoices');
            }}
          />
        )}

        {currentTab === 'editor' && (
          <InvoiceEditor
            invoice={currentInvoice}
            onChange={setCurrentInvoice}
            onSave={handleSaveInvoice}
            onShowToast={addToast}
          />
        )}

        {currentTab === 'history' && (
          <InvoiceHistoryView
            invoices={invoices}
            onNewInvoice={handleNewInvoice}
            onEditInvoice={handleEditInvoice}
            onDuplicateInvoice={handleDuplicateInvoice}
            onDeleteInvoice={handleDeleteInvoice}
            onUpdateInvoice={handleUpdateInvoice}
            onShowToast={addToast}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsView
            settings={settings}
            onSaveSettings={handleSaveSettings}
            onReloadAllData={handleReloadAllData}
            onShowToast={addToast}
          />
        )}
      </main>

      {/* Global Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Clean Footer */}
      <footer className="no-print mt-auto border-t border-orange-200/60 bg-[#FFFDF9] py-6 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-800 font-display">QuickInvoice</span>
            <span>•</span>
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              100% Client-Side & Private (Zero remote data storage)
            </span>
          </div>

          <div className="flex items-center gap-4 text-stone-400">
            <span>Free invoicing for freelancers & local vendors</span>
            <span>•</span>
            <button
              type="button"
              onClick={() => setCurrentTab('settings')}
              className="text-orange-700 hover:text-orange-900 font-bold transition cursor-pointer"
            >
              Export / Import Backups
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
