import React, { useState, useMemo } from 'react';
import { Invoice, InvoiceStatus } from '../../types/invoice';
import { StatusBadge } from '../common/Badge';
import { RecordPaymentModal } from './RecordPaymentModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { InvoicePreview } from '../InvoicePreview/InvoicePreview';
import { calculateInvoice, getComputedInvoiceStatus } from '../../utils/calculations';
import { formatCurrency } from '../../utils/currency';
import { downloadInvoiceAsPdf, triggerPrint } from '../../utils/pdf';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Copy,
  Trash2,
  Printer,
  Download,
  CreditCard,
  X,
  FileText,
  ArrowUpDown,
} from 'lucide-react';

interface InvoiceHistoryViewProps {
  invoices: Invoice[];
  onNewInvoice: () => void;
  onEditInvoice: (invoice: Invoice) => void;
  onDuplicateInvoice: (invoice: Invoice) => void;
  onDeleteInvoice: (id: string) => void;
  onUpdateInvoice: (invoice: Invoice) => void;
  onShowToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

type SortField = 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc' | 'number';

export const InvoiceHistoryView: React.FC<InvoiceHistoryViewProps> = ({
  invoices,
  onNewInvoice,
  onEditInvoice,
  onDuplicateInvoice,
  onDeleteInvoice,
  onUpdateInvoice,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | InvoiceStatus>('all');
  const [sortBy, setSortBy] = useState<SortField>('date_desc');

  // Modals state
  const [paymentModalInvoice, setPaymentModalInvoice] = useState<Invoice | null>(null);
  const [deleteModalInvoice, setDeleteModalInvoice] = useState<Invoice | null>(null);
  const [previewModalInvoice, setPreviewModalInvoice] = useState<Invoice | null>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  // Filter and sort invoices
  const filteredInvoices = useMemo(() => {
    return invoices
      .filter(inv => {
        const computedStatus = getComputedInvoiceStatus(inv);
        if (statusFilter !== 'all' && computedStatus !== statusFilter) {
          return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchNum = inv.invoiceNumber.toLowerCase().includes(q);
          const matchClientName = (inv.client.name || '').toLowerCase().includes(q);
          const matchClientCompany = (inv.client.companyName || '').toLowerCase().includes(q);
          const matchPo = (inv.poNumber || '').toLowerCase().includes(q);
          const matchItem = inv.items?.some(i => i.description.toLowerCase().includes(q));

          return matchNum || matchClientName || matchClientCompany || matchPo || matchItem;
        }

        return true;
      })
      .sort((a, b) => {
        const calcA = calculateInvoice(a);
        const calcB = calculateInvoice(b);

        if (sortBy === 'date_desc') {
          return new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime();
        }
        if (sortBy === 'date_asc') {
          return new Date(a.date || a.createdAt).getTime() - new Date(b.date || b.createdAt).getTime();
        }
        if (sortBy === 'amount_desc') {
          return calcB.grandTotal - calcA.grandTotal;
        }
        if (sortBy === 'amount_asc') {
          return calcA.grandTotal - calcB.grandTotal;
        }
        if (sortBy === 'number') {
          return b.invoiceNumber.localeCompare(a.invoiceNumber);
        }
        return 0;
      });
  }, [invoices, statusFilter, searchQuery, sortBy]);

  const totalFilteredValue = useMemo(() => {
    return filteredInvoices.reduce((acc, inv) => acc + calculateInvoice(inv).grandTotal, 0);
  }, [filteredInvoices]);

  const primaryCurrency = invoices[0]?.currency || 'INR';
  const primarySymbol = invoices[0]?.currencySymbol || '₹';

  const handleDownloadSinglePdf = async (inv: Invoice) => {
    setIsDownloadingPdf(true);
    onShowToast('info', `Preparing PDF for #${inv.invoiceNumber}...`);
    try {
      setPreviewModalInvoice(inv);
      setTimeout(async () => {
        const filename = `Invoice_${inv.invoiceNumber}.pdf`;
        const ok = await downloadInvoiceAsPdf('modal-invoice-preview', filename);
        if (ok) {
          onShowToast('success', `Downloaded ${filename}`);
        } else {
          onShowToast('error', 'Failed to generate PDF.');
        }
        setIsDownloadingPdf(false);
      }, 300);
    } catch {
      onShowToast('error', 'Error generating PDF.');
      setIsDownloadingPdf(false);
    }
  };

  const handlePrintSingle = (inv: Invoice) => {
    setPreviewModalInvoice(inv);
    setTimeout(() => {
      triggerPrint();
    }, 200);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 font-display">
            Invoice History
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Search, filter, track client payments, and duplicate previous transactions
          </p>
        </div>

        <button
          type="button"
          onClick={onNewInvoice}
          className="px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-orange-500/25 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Invoice</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white/95 rounded-2xl border border-orange-200/60 p-4 sm:p-5 shadow-sm space-y-3.5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-orange-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by invoice #, client, item..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-orange-200/80 bg-white text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <span className="text-xs text-stone-500 flex items-center gap-1 font-semibold">
              <ArrowUpDown className="w-3.5 h-3.5 text-orange-600" />
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortField)}
              className="px-3 py-1.5 rounded-xl border border-orange-200/80 text-xs text-stone-900 bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition cursor-pointer"
            >
              <option value="date_desc">Date: Newest First</option>
              <option value="date_asc">Date: Oldest First</option>
              <option value="amount_desc">Amount: High to Low</option>
              <option value="amount_asc">Amount: Low to High</option>
              <option value="number">Invoice Number</option>
            </select>
          </div>
        </div>

        {/* Status Filters Pills */}
        <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-orange-100/70 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-stone-400 mr-1 flex items-center gap-1 font-medium">
              <Filter className="w-3 h-3 text-orange-500" /> Status:
            </span>
            {(['all', 'unpaid', 'partially_paid', 'paid', 'overdue', 'draft'] as const).map(st => {
              const isActive = statusFilter === st;
              const labels: Record<string, string> = {
                all: 'All Invoices',
                unpaid: 'Unpaid',
                partially_paid: 'Partially Paid',
                paid: 'Paid',
                overdue: 'Overdue',
                draft: 'Draft',
              };

              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-xs'
                      : 'bg-orange-50/70 text-stone-700 hover:bg-orange-100/80 border border-orange-200/60'
                  }`}
                >
                  {labels[st]}
                </button>
              );
            })}
          </div>

          <div className="text-xs text-stone-500 font-medium">
            Showing <strong className="text-stone-900">{filteredInvoices.length}</strong> of {invoices.length} • Total:{' '}
            <strong className="text-stone-900 font-mono font-bold">
              {formatCurrency(totalFilteredValue, primaryCurrency, primarySymbol)}
            </strong>
          </div>
        </div>
      </div>

      {/* Invoices Data Table */}
      <div className="bg-white/95 rounded-2xl border border-orange-200/60 shadow-sm overflow-hidden">
        {filteredInvoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-orange-50/70 border-b border-orange-200/60 text-stone-700 font-semibold font-display">
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Invoice Date</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Total Amount</th>
                  <th className="py-3 px-4 text-right">Amount Paid</th>
                  <th className="py-3 px-4 text-right">Balance Due</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-100/60">
                {filteredInvoices.map(inv => {
                  const calc = calculateInvoice(inv);
                  const status = getComputedInvoiceStatus(inv);

                  return (
                    <tr key={inv.id} className="hover:bg-orange-50/40 transition-colors group">
                      <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                        {inv.invoiceNumber}
                        {inv.poNumber && (
                          <span className="block text-[10px] text-stone-400 font-sans font-normal">
                            PO: {inv.poNumber}
                          </span>
                        )}
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
                      <td className="py-3.5 px-4 text-right font-mono text-emerald-700 font-semibold">
                        {calc.totalPaid > 0
                          ? formatCurrency(calc.totalPaid, inv.currency, inv.currencySymbol)
                          : '—'}
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
                            onClick={() => setPreviewModalInvoice(inv)}
                            className="p-1.5 text-stone-500 hover:text-orange-700 hover:bg-orange-100/70 rounded-lg transition cursor-pointer"
                            title="Preview Invoice"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onEditInvoice(inv)}
                            className="p-1.5 text-stone-500 hover:text-orange-700 hover:bg-orange-100/70 rounded-lg transition cursor-pointer"
                            title="Edit Invoice"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentModalInvoice(inv)}
                            className="p-1.5 text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                            title="Record Payment"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDuplicateInvoice(inv)}
                            className="p-1.5 text-stone-500 hover:text-orange-700 hover:bg-orange-100/70 rounded-lg transition cursor-pointer"
                            title="Duplicate as New Invoice"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteModalInvoice(inv)}
                            className="p-1.5 text-stone-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            title="Delete Invoice"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-stone-800 font-display">No Invoices Found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              {searchQuery || statusFilter !== 'all'
                ? 'Try clearing your search query or status filter.'
                : 'You have not created any invoices yet.'}
            </p>
            {(searchQuery || statusFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="px-4 py-1.5 rounded-xl bg-orange-100 text-orange-950 font-bold text-xs hover:bg-orange-200 transition cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Record Payment Modal */}
      {paymentModalInvoice && (
        <RecordPaymentModal
          invoice={paymentModalInvoice}
          isOpen={true}
          onClose={() => setPaymentModalInvoice(null)}
          onSavePayments={updated => {
            onUpdateInvoice(updated);
            onShowToast('success', `Payment updated for #${updated.invoiceNumber}`);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalInvoice && (
        <DeleteConfirmModal
          isOpen={true}
          invoiceNumber={deleteModalInvoice.invoiceNumber}
          onCancel={() => setDeleteModalInvoice(null)}
          onConfirm={() => {
            onDeleteInvoice(deleteModalInvoice.id);
            setDeleteModalInvoice(null);
            onShowToast('info', `Invoice #${deleteModalInvoice.invoiceNumber} deleted.`);
          }}
        />
      )}

      {/* Full-Screen Invoice Preview Modal */}
      {previewModalInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#FAF7F2] rounded-3xl shadow-2xl border border-orange-200/80 w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden">
            {/* Modal Bar */}
            <div className="no-print p-4 bg-white/95 border-b border-orange-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="font-bold text-stone-900 text-sm font-display">
                  Preview: #{previewModalInvoice.invoiceNumber}
                </span>
                <StatusBadge status={getComputedInvoiceStatus(previewModalInvoice)} size="sm" />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePrintSingle(previewModalInvoice)}
                  className="px-3.5 py-1.5 rounded-xl border border-orange-200/80 hover:bg-orange-50 text-stone-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-stone-600" />
                  <span>Print</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadSinglePdf(previewModalInvoice)}
                  disabled={isDownloadingPdf}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-orange-500/20 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isDownloadingPdf ? 'Exporting...' : 'PDF'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onEditInvoice(previewModalInvoice)}
                  className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewModalInvoice(null)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <InvoicePreview invoice={previewModalInvoice} id="modal-invoice-preview" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
