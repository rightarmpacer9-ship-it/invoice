import React, { useState } from 'react';
import { Invoice } from '../../types/invoice';
import { BusinessSection } from './BusinessSection';
import { ClientSection } from './ClientSection';
import { InvoiceMetaSection } from './InvoiceMetaSection';
import { LineItemsSection } from './LineItemsSection';
import { TaxDiscountSection } from './TaxDiscountSection';
import { NotesTermsSection } from './NotesTermsSection';
import { InvoicePreview } from '../InvoicePreview/InvoicePreview';
import { TemplateSelector } from '../InvoicePreview/TemplateSelector';
import { downloadInvoiceAsPdf, triggerPrint } from '../../utils/pdf';
import { getComputedInvoiceStatus } from '../../utils/calculations';
import {
  Save,
  Printer,
  Download,
  Eye,
  Edit3,
  Columns,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface InvoiceEditorProps {
  invoice: Invoice;
  onChange: (updated: Invoice) => void;
  onSave: (invoice: Invoice) => void;
  onShowToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

type ViewMode = 'split' | 'editor' | 'preview';

export const InvoiceEditor: React.FC<InvoiceEditorProps> = ({
  invoice,
  onChange,
  onSave,
  onShowToast,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleUpdate = (patch: Partial<Invoice>) => {
    const updated = {
      ...invoice,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    if (updated.status !== 'draft') {
      updated.status = getComputedInvoiceStatus(updated);
    }
    onChange(updated);
  };

  const validateInvoice = (): boolean => {
    if (!invoice.seller.name.trim()) {
      setValidationError('Please enter your Business or Freelancer Name.');
      return false;
    }
    if (!invoice.client.name.trim() && !invoice.client.companyName?.trim()) {
      setValidationError('Please enter the Client Name or Company Name.');
      return false;
    }
    if (!invoice.invoiceNumber.trim()) {
      setValidationError('Please provide a valid Invoice Number.');
      return false;
    }
    if (!invoice.items || invoice.items.length === 0 || !invoice.items[0].description.trim()) {
      setValidationError('Please add at least one line item with a description.');
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleSaveInvoice = (statusOverride?: 'draft' | 'unpaid') => {
    if (statusOverride !== 'draft' && !validateInvoice()) {
      onShowToast('error', validationError || 'Please fill in required fields.');
      return;
    }

    const toSave: Invoice = {
      ...invoice,
      status: statusOverride || getComputedInvoiceStatus(invoice),
      updatedAt: new Date().toISOString(),
    };

    onSave(toSave);
    onShowToast('success', `Invoice #${toSave.invoiceNumber} saved successfully!`);
  };

  const handleDownloadPdf = async () => {
    if (!validateInvoice()) {
      onShowToast('error', validationError || 'Please fill required fields before export.');
      return;
    }

    setIsExportingPdf(true);
    onShowToast('info', 'Generating high-resolution PDF...');

    try {
      handleSaveInvoice();
      const filename = `Invoice_${invoice.invoiceNumber || 'Draft'}.pdf`;
      const ok = await downloadInvoiceAsPdf('invoice-render-target', filename);
      if (ok) {
        onShowToast('success', `Downloaded ${filename}`);
      } else {
        onShowToast('error', 'Failed to generate PDF. You can also use the Print button.');
      }
    } catch {
      onShowToast('error', 'Error while exporting PDF.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handlePrint = () => {
    handleSaveInvoice();
    triggerPrint();
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar / Actions Bar */}
      <div className="no-print bg-[#FFFDF9]/95 rounded-2xl border border-orange-200/70 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 sticky top-16 z-20 backdrop-blur-md">
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Segmented View Mode */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-orange-100/60 border border-orange-200/60 text-xs font-bold font-display">
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'split'
                  ? 'bg-white shadow-xs text-orange-950 font-bold'
                  : 'text-stone-600 hover:text-orange-900'
              }`}
              title="Split View (Form + Preview)"
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Split</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('editor')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'editor'
                  ? 'bg-white shadow-xs text-orange-950 font-bold'
                  : 'text-stone-600 hover:text-orange-900'
              }`}
              title="Editor Only"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Editor</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'preview'
                  ? 'bg-white shadow-xs text-orange-950 font-bold'
                  : 'text-stone-600 hover:text-orange-900'
              }`}
              title="Live Preview Only"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Preview</span>
            </button>
          </div>

          <div className="text-xs text-stone-500 hidden lg:block font-medium">
            <span className="font-mono font-bold text-stone-900">#{invoice.invoiceNumber}</span>
            <span className="mx-2 text-stone-300">•</span>
            <span className="text-amber-800 font-semibold">Live Real-time calculation</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
          <button
            type="button"
            onClick={() => handleSaveInvoice('draft')}
            className="px-3.5 py-2 rounded-xl border border-orange-200/80 bg-white hover:bg-orange-50/70 text-stone-700 text-xs font-bold transition cursor-pointer"
          >
            Save Draft
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl border border-orange-200/80 bg-white hover:bg-orange-50/70 text-stone-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-stone-600" />
            <span>Print</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExportingPdf ? 'Exporting...' : 'Download PDF'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSaveInvoice()}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-orange-500/25 hover:shadow-orange-500/40 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Invoice</span>
          </button>
        </div>
      </div>

      {/* Validation alert banner */}
      {validationError && (
        <div className="no-print p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold flex items-center gap-2 shadow-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Grid view */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Editor Form Column */}
        {(viewMode === 'editor' || viewMode === 'split') && (
          <div
            className={`space-y-6 ${
              viewMode === 'split' ? 'lg:col-span-6 xl:col-span-6' : 'lg:col-span-12 max-w-4xl mx-auto w-full'
            }`}
          >
            <InvoiceMetaSection
              invoiceNumber={invoice.invoiceNumber}
              poNumber={invoice.poNumber}
              date={invoice.date}
              dueDate={invoice.dueDate}
              currency={invoice.currency}
              onUpdate={fields => handleUpdate(fields)}
            />

            <BusinessSection
              business={invoice.seller}
              onChange={seller => handleUpdate({ seller })}
            />

            <ClientSection
              client={invoice.client}
              onChange={client => handleUpdate({ client })}
            />

            <LineItemsSection
              items={invoice.items}
              currency={invoice.currency}
              currencySymbol={invoice.currencySymbol}
              showHsnSac={invoice.customization?.showHsnSac || false}
              onChange={items => handleUpdate({ items })}
            />

            <TaxDiscountSection
              discountType={invoice.discountType}
              discountValue={invoice.discountValue}
              taxType={invoice.taxType}
              standardTaxRate={invoice.standardTaxRate}
              standardTaxLabel={invoice.standardTaxLabel}
              gstType={invoice.gstType}
              gstRate={invoice.gstRate}
              shippingOrCharges={invoice.shippingOrCharges}
              chargesLabel={invoice.chargesLabel}
              currencySymbol={invoice.currencySymbol}
              onUpdate={fields => handleUpdate(fields)}
            />

            <NotesTermsSection
              paymentDetails={invoice.paymentDetails}
              notes={invoice.notes}
              terms={invoice.terms}
              signatureText={invoice.customization?.signatureText}
              onUpdatePayment={paymentDetails => handleUpdate({ paymentDetails })}
              onUpdateText={({ notes, terms, signatureText }) => {
                const patch: any = {};
                if (notes !== undefined) patch.notes = notes;
                if (terms !== undefined) patch.terms = terms;
                if (signatureText !== undefined) {
                  patch.customization = {
                    ...invoice.customization,
                    signatureText,
                  };
                }
                handleUpdate(patch);
              }}
            />

            <TemplateSelector
              customization={invoice.customization}
              onChange={customization => handleUpdate({ customization })}
            />
          </div>
        )}

        {/* Live Preview Column */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div
            className={`space-y-4 ${
              viewMode === 'split'
                ? 'lg:col-span-6 xl:col-span-6 lg:sticky lg:top-36'
                : 'lg:col-span-12 max-w-4xl mx-auto w-full'
            }`}
          >
            <div className="flex items-center justify-between no-print px-1 text-xs text-stone-500 font-semibold font-display">
              <span className="flex items-center gap-1.5 text-stone-700">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Live Document Preview (A4 Page Fit)
              </span>
              <span className="text-amber-800/80 font-medium">Updates in real time</span>
            </div>

            <div className="overflow-x-auto pb-4 custom-scrollbar">
              <InvoicePreview invoice={invoice} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
