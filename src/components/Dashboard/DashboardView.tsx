import React from 'react';
import { Invoice } from '../../types/invoice';
import { StatCard } from './StatCard';
import { StatusBadge } from '../common/Badge';
import { calculateInvoice, getComputedInvoiceStatus } from '../../utils/calculations';
import { formatCurrency } from '../../utils/currency';
import {
  FileText,
  DollarSign,
  TrendingUp,
  AlertCircle,
  PlusCircle,
  ArrowRight,
  Eye,
  Edit2,
  Copy,
  Receipt,
  Sparkles,
  CreditCard,
} from 'lucide-react';

interface DashboardViewProps {
  invoices: Invoice[];
  onNewInvoice: () => void;
  onEditInvoice: (invoice: Invoice) => void;
  onDuplicateInvoice: (invoice: Invoice) => void;
  onViewInvoice: (invoice: Invoice) => void;
  onRecordPayment: (invoice: Invoice) => void;
  onGoToHistory: () => void;
  onLoadSamples: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  invoices,
  onNewInvoice,
  onEditInvoice,
  onDuplicateInvoice,
  onViewInvoice,
  onRecordPayment,
  onGoToHistory,
  onLoadSamples,
}) => {
  // Aggregate stats
  let totalInvoiced = 0;
  let totalReceived = 0;
  let totalOutstanding = 0;
  let overdueAmount = 0;
  let overdueCount = 0;
  let paidCount = 0;

  const countByStatus: Record<string, number> = {
    paid: 0,
    partially_paid: 0,
    unpaid: 0,
    overdue: 0,
    draft: 0,
  };

  for (const inv of invoices) {
    const calc = calculateInvoice(inv);
    const computedStatus = getComputedInvoiceStatus(inv);

    totalInvoiced += calc.grandTotal;
    totalReceived += calc.totalPaid;
    totalOutstanding += calc.outstandingBalance;

    countByStatus[computedStatus] = (countByStatus[computedStatus] || 0) + 1;

    if (computedStatus === 'overdue') {
      overdueAmount += calc.outstandingBalance;
      overdueCount += 1;
    } else if (computedStatus === 'paid') {
      paidCount += 1;
    }
  }

  const primaryCurrency = invoices[0]?.currency || 'INR';
  const primarySymbol = invoices[0]?.currencySymbol || '₹';

  const collectionRate = totalInvoiced > 0 ? Math.round((totalReceived / totalInvoiced) * 100) : 0;

  // Recent 5 invoices
  const recentInvoices = [...invoices]
    .sort((a, b) => new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner - Warm Sunset & Terracotta */}
      <div className="rounded-3xl bg-gradient-to-br from-orange-600 via-amber-700 to-stone-900 text-white p-7 sm:p-9 shadow-lg shadow-orange-950/15 relative overflow-hidden border border-orange-500/20">
        {/* Warm ambient glows */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-gradient-to-br from-amber-400/25 via-orange-400/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-amber-200 text-xs font-bold border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Zero-Setup Invoicing for Freelancers & SMBs</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-display text-white">
              Create & Send Invoices in Seconds
            </h1>
            <p className="text-sm text-orange-100/90 leading-relaxed font-normal">
              No registration needed. Real-time GST & tax calculations, beautiful A4 PDF generation, and local browser persistence.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              type="button"
              onClick={onNewInvoice}
              className="px-5 py-3 rounded-xl bg-white text-orange-950 hover:bg-orange-50 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-950/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-orange-600" />
              <span>Create New Invoice</span>
            </button>
            <button
              type="button"
              onClick={onGoToHistory}
              className="px-4 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs flex items-center justify-center gap-1.5 backdrop-blur-md transition-all border border-white/20 cursor-pointer"
            >
              <span>View History ({invoices.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards with Warm Color Grading */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Total Invoiced"
          value={formatCurrency(totalInvoiced, primaryCurrency, primarySymbol)}
          subtext={`Across ${invoices.length} invoices generated`}
          icon={<FileText className="w-5 h-5" />}
          colorClass="text-orange-600"
          bgLightClass="bg-orange-50"
          accentGradient="from-orange-500 via-amber-500 to-amber-400"
        />
        <StatCard
          title="Payments Received"
          value={formatCurrency(totalReceived, primaryCurrency, primarySymbol)}
          subtext={`${collectionRate}% collection rate`}
          icon={<TrendingUp className="w-5 h-5" />}
          colorClass="text-emerald-700"
          bgLightClass="bg-emerald-50"
          accentGradient="from-emerald-500 to-teal-500"
        />
        <StatCard
          title="Outstanding Balance"
          value={formatCurrency(totalOutstanding, primaryCurrency, primarySymbol)}
          subtext="Awaiting client settlement"
          icon={<DollarSign className="w-5 h-5" />}
          colorClass="text-amber-700"
          bgLightClass="bg-amber-50"
          accentGradient="from-amber-500 to-yellow-500"
        />
        <StatCard
          title="Overdue Receivables"
          value={formatCurrency(overdueAmount, primaryCurrency, primarySymbol)}
          subtext={`${overdueCount} invoice${overdueCount === 1 ? '' : 's'} past due date`}
          icon={<AlertCircle className="w-5 h-5" />}
          colorClass="text-rose-700"
          bgLightClass="bg-rose-50"
          accentGradient="from-rose-500 to-red-500"
        />
      </div>

      {/* Status Distribution Progress */}
      {invoices.length > 0 && (
        <div className="bg-white/95 rounded-2xl border border-orange-200/60 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-stone-800 font-display">
            <span>Invoice Status Breakdown</span>
            <span className="text-stone-400 font-normal">
              {paidCount} of {invoices.length} settled
            </span>
          </div>

          <div className="h-2.5 w-full bg-orange-100/50 rounded-full overflow-hidden flex">
            {countByStatus.paid > 0 && (
              <div
                style={{ width: `${(countByStatus.paid / invoices.length) * 100}%` }}
                className="bg-emerald-500 h-full"
                title={`Paid: ${countByStatus.paid}`}
              />
            )}
            {countByStatus.partially_paid > 0 && (
              <div
                style={{ width: `${(countByStatus.partially_paid / invoices.length) * 100}%` }}
                className="bg-orange-500 h-full"
                title={`Partially Paid: ${countByStatus.partially_paid}`}
              />
            )}
            {countByStatus.unpaid > 0 && (
              <div
                style={{ width: `${(countByStatus.unpaid / invoices.length) * 100}%` }}
                className="bg-amber-500 h-full"
                title={`Unpaid: ${countByStatus.unpaid}`}
              />
            )}
            {countByStatus.overdue > 0 && (
              <div
                style={{ width: `${(countByStatus.overdue / invoices.length) * 100}%` }}
                className="bg-rose-500 h-full"
                title={`Overdue: ${countByStatus.overdue}`}
              />
            )}
            {countByStatus.draft > 0 && (
              <div
                style={{ width: `${(countByStatus.draft / invoices.length) * 100}%` }}
                className="bg-stone-300 h-full"
                title={`Draft: ${countByStatus.draft}`}
              />
            )}
          </div>

          <div className="flex items-center gap-4 text-xs flex-wrap pt-1 text-stone-600 font-medium">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Paid ({countByStatus.paid || 0})
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              Partially Paid ({countByStatus.partially_paid || 0})
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Unpaid ({countByStatus.unpaid || 0})
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Overdue ({countByStatus.overdue || 0})
            </span>
            {countByStatus.draft > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-stone-300" />
                Draft ({countByStatus.draft})
              </span>
            )}
          </div>
        </div>
      )}

      {/* Recent Invoices Table */}
      <div className="bg-white/95 rounded-2xl border border-orange-200/60 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-orange-100 flex items-center justify-between bg-orange-50/30">
          <div>
            <h2 className="text-base font-bold text-stone-900 font-display">Recent Invoices</h2>
            <p className="text-xs text-stone-500">Your latest transactions and billing activity</p>
          </div>
          {invoices.length > 5 && (
            <button
              type="button"
              onClick={onGoToHistory}
              className="text-xs font-bold text-orange-700 hover:text-orange-900 flex items-center gap-1 transition cursor-pointer"
            >
              <span>View all ({invoices.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {recentInvoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-orange-50/70 border-b border-orange-200/60 text-stone-700 font-semibold font-display">
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-right">Balance</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-100/60">
                {recentInvoices.map(inv => {
                  const calc = calculateInvoice(inv);
                  const status = getComputedInvoiceStatus(inv);

                  return (
                    <tr key={inv.id} className="hover:bg-orange-50/40 transition-colors group">
                      <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-stone-800">
                          {inv.client.companyName || inv.client.name || 'Unnamed Client'}
                        </p>
                        {inv.client.companyName && inv.client.name && (
                          <p className="text-[11px] text-stone-400">{inv.client.name}</p>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-stone-600 font-mono">{inv.date}</td>
                      <td className="py-3.5 px-4 text-stone-600 font-mono">{inv.dueDate || '—'}</td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-stone-900">
                        {formatCurrency(calc.grandTotal, inv.currency, inv.currencySymbol)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-semibold">
                        <span className={calc.outstandingBalance > 0 ? 'text-amber-700' : 'text-emerald-700'}>
                          {formatCurrency(calc.outstandingBalance, inv.currency, inv.currencySymbol)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <StatusBadge status={status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => onViewInvoice(inv)}
                            className="p-1.5 text-stone-500 hover:text-orange-700 hover:bg-orange-100/70 rounded-lg transition cursor-pointer"
                            title="Preview / Print"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onEditInvoice(inv)}
                            className="p-1.5 text-stone-500 hover:text-orange-700 hover:bg-orange-100/70 rounded-lg transition cursor-pointer"
                            title="Edit Invoice"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onRecordPayment(inv)}
                            className="p-1.5 text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                            title="Record Payment"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDuplicateInvoice(inv)}
                            className="p-1.5 text-stone-500 hover:text-orange-700 hover:bg-orange-100/70 rounded-lg transition cursor-pointer"
                            title="Duplicate"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-3 bg-orange-50/20">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center mx-auto shadow-xs">
              <Receipt className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-stone-800 font-display">No Invoices Saved Yet</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Create your very first invoice now or load our sample template data to test out all features.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={onNewInvoice}
                className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 transition cursor-pointer"
              >
                Create Invoice
              </button>
              <button
                type="button"
                onClick={onLoadSamples}
                className="px-4 py-2 bg-orange-100/70 hover:bg-orange-100 text-orange-950 rounded-xl text-xs font-bold transition border border-orange-200 cursor-pointer"
              >
                Load Demo Invoices
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
