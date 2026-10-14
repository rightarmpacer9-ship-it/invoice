import React, { useState } from 'react';
import {
  LayoutDashboard,
  FilePlus,
  History,
  Settings as SettingsIcon,
  Receipt,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

export type NavTab = 'dashboard' | 'editor' | 'history' | 'settings';

interface NavbarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onNewInvoice: () => void;
  invoiceCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  onNewInvoice,
  invoiceCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSelectTab = (tab: NavTab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-orange-200/60 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-6">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-8">
            <button
              type="button"
              onClick={() => handleSelectTab('dashboard')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 via-amber-600 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 group-hover:shadow-orange-500/35 transition-all">
                <Receipt className="w-5 h-5 stroke-[2.4]" />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-stone-900 font-display">
                  Quick<span className="bg-gradient-to-r from-orange-600 via-amber-600 to-amber-500 bg-clip-text text-transparent">Invoice</span>
                </span>
                <span className="block text-[10px] font-bold text-amber-700/80 uppercase tracking-widest -mt-1">
                  Zero-Setup & Free
                </span>
              </div>
            </button>

            {/* Zone 2: Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => handleSelectTab('dashboard')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  currentTab === 'dashboard'
                    ? 'bg-orange-100/80 text-orange-950 font-bold shadow-xs'
                    : 'text-stone-600 hover:text-orange-900 hover:bg-orange-50/60'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTab('editor')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  currentTab === 'editor'
                    ? 'bg-orange-100/80 text-orange-950 font-bold shadow-xs'
                    : 'text-stone-600 hover:text-orange-900 hover:bg-orange-50/60'
                }`}
              >
                <FilePlus className="w-3.5 h-3.5" />
                <span>Create Invoice</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTab('history')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  currentTab === 'history'
                    ? 'bg-orange-100/80 text-orange-950 font-bold shadow-xs'
                    : 'text-stone-600 hover:text-orange-900 hover:bg-orange-50/60'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Invoice History</span>
                {invoiceCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-md text-[10px] bg-amber-200/70 text-amber-950 font-mono font-bold">
                    {invoiceCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleSelectTab('settings')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  currentTab === 'settings'
                    ? 'bg-orange-100/80 text-orange-950 font-bold shadow-xs'
                    : 'text-stone-600 hover:text-orange-900 hover:bg-orange-50/60'
                }`}
              >
                <SettingsIcon className="w-3.5 h-3.5" />
                <span>Settings</span>
              </button>
            </nav>
          </div>

          {/* Zone 3: Primary Action & Offline badge */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50/90 text-amber-950 text-[11px] font-semibold border border-amber-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>Offline Ready • Local Storage</span>
            </div>

            <button
              type="button"
              onClick={onNewInvoice}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white text-xs font-bold shadow-md shadow-orange-500/25 hover:shadow-orange-500/40 active:scale-[0.98] transition-all cursor-pointer"
            >
              <FilePlus className="w-3.5 h-3.5" />
              <span>+ New Invoice</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-700 hover:text-orange-900 rounded-lg hover:bg-orange-50/80 transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-orange-200/60 space-y-1 bg-[#FFFDF9]">
            <button
              type="button"
              onClick={() => handleSelectTab('dashboard')}
              className={`w-full px-3 py-2.5 rounded-lg flex items-center gap-2 text-xs font-semibold ${
                currentTab === 'dashboard' ? 'bg-orange-100 text-orange-950' : 'text-stone-700'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectTab('editor')}
              className={`w-full px-3 py-2.5 rounded-lg flex items-center gap-2 text-xs font-semibold ${
                currentTab === 'editor' ? 'bg-orange-100 text-orange-950' : 'text-stone-700'
              }`}
            >
              <FilePlus className="w-4 h-4" />
              <span>Create Invoice</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectTab('history')}
              className={`w-full px-3 py-2.5 rounded-lg flex items-center justify-between text-xs font-semibold ${
                currentTab === 'history' ? 'bg-orange-100 text-orange-950' : 'text-stone-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <History className="w-4 h-4" />
                <span>Invoice History</span>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] bg-amber-200 text-amber-950 font-bold">
                {invoiceCount}
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectTab('settings')}
              className={`w-full px-3 py-2.5 rounded-lg flex items-center gap-2 text-xs font-semibold ${
                currentTab === 'settings' ? 'bg-orange-100 text-orange-950' : 'text-stone-700'
              }`}
            >
              <SettingsIcon className="w-4 h-4" />
              <span>Settings</span>
            </button>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  onNewInvoice();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-orange-500/20"
              >
                <FilePlus className="w-4 h-4" />
                <span>Create New Invoice</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
