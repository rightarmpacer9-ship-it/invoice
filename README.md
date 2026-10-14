# QuickInvoice - Free & Zero-Setup Professional Invoicing Web App

**QuickInvoice** is a modern, responsive web application engineered for freelancers, independent contractors, small businesses, and local vendors. It eliminates the complexity, paywalls, and mandatory signups of traditional invoicing platforms by allowing users to create, preview, calculate, print, and download professional PDF invoices immediately from their browser.

---

## 🌟 Key Features

### 1. Zero-Setup & Local Privacy
- **No Sign-Up or Paywall Required:** Users can immediately begin generating invoices within seconds.
- **Local Browser Persistence:** All invoices, customer records, and company settings are saved in your browser (`localStorage`), keeping your financial data completely private and accessible offline.
- **Backup & Restore:** Full JSON export and import allows backing up all historical records and moving data between devices.

### 2. Comprehensive Invoice Creation
- **Business Profile (Bill From):** Company / freelancer name, GSTIN/Tax ID, address, email, phone number, website, and company logo upload.
- **Client Profile (Bill To):** Client name, company name, GSTIN/Tax ID, billing address, email, and phone.
- **Invoice Metadata:** Auto-incrementing invoice numbering, Purchase Order (PO) number, invoice date, and customizable due date presets (On Receipt, Net 7, Net 15, Net 30, Net 60).
- **Dynamic Line Items:** Unlimited line items with description, optional HSN/SAC codes, real-time quantity, unit price, item-level discounts, and subtotal. Add, duplicate, or delete rows on the fly.
- **Payment Instructions & Signatory:** Direct bank account details (Bank, A/C No, IFSC / Routing, SWIFT), UPI ID for instant mobile payment, customizable terms & conditions, notes, and authorized signatory label.

### 3. Real-Time Accurate Calculations
- **Decimal Precision:** Real-time arithmetic ensuring exact calculations without floating-point drift.
- **Multi-Level Discounts:** Supports item-level discount percentage as well as invoice-level discount (percentage or fixed amount).
- **Configurable Taxes & Indian GST:**
  - Standard Tax / VAT with custom label and rate.
  - Indian GST with automatic Intra-State (CGST + SGST split 50/50) or Inter-State (IGST) selection and standard slab rates (0%, 5%, 12%, 18%, 28%).
- **Additional Charges:** Flat fees for delivery, shipping, or handling.
- **Amount in Words:** Automatically converts grand totals to formatted words (supporting Indian numbering with Lakhs/Crores and Western millions).

### 4. Live Split-Screen Preview & Styling
- **Real-Time Live Document:** The invoice preview responds instantaneously as you type.
- **Multiple View Modes:** Switch effortlessly between Split View (form + preview), Editor Only, and Full Document Preview.
- **Custom Themes & Colors:** Choose from 6 curated professional accent colors (Indigo, Blue, Emerald, Slate, Violet, Amber) and customize table columns (HSN/SAC, payment info, signature).

### 5. High-Fidelity Download & Print
- **Pixel-Perfect A4 Format:** Cleanly formatted for standard A4 printing.
- **Dedicated Print Stylesheet:** Browser print mode (`Ctrl+P` / `Cmd+P` or via the Print button) hides toolbars, navigation, and editing forms, printing only the pristine invoice document.
- **Client-Side PDF Generation:** Exports high-resolution 2x retina PDFs (`jspdf` + `html2canvas`) directly to your downloads folder.
- **Multi-Currency Support:** INR (`₹`), USD (`$`), EUR (`€`), GBP (`£`), CAD (`CA$`), AUD (`A$`), AED (`AED`), SGD (`S$`), and JPY (`¥`).

### 6. Transaction History & Payment Tracking
- **Search & Filter:** Search by invoice number, client name, or line items. Filter by status (`Paid`, `Partially Paid`, `Unpaid`, `Overdue`, `Draft`) or sort by date/amount.
- **Payment Logger:** Record partial or full payments with date, payment method (Bank Transfer, UPI, Cash, Card, Cheque), reference/UTR numbers, and transaction notes.
- **Automatic Status Management:** Automatically tracks and marks invoices as Paid, Partially Paid, or Overdue based on due date and remaining balance.
- **Invoice Duplication:** One-click duplicate creates a new sequential invoice with today's date while retaining items and client info.
- **Deletion Protection:** Deletion modal ensures safe management of historical records.

### 7. Executive Dashboard & Analytics
- **Key Metrics:** Total Invoiced Amount, Total Payments Received, Total Outstanding Receivables, and Overdue Count/Amount.
- **Status Distribution:** Visual progress bar depicting payment settlement ratios.
- **Recent Invoices:** Fast-action table to view, edit, duplicate, or record payment.

---

## 🛠️ Technology Stack

- **Frontend Framework:** React 19 + TypeScript
- **Build Tool:** Vite 8
- **Styling:** Tailwind CSS v4 with modern semantic tokens and `@media print` rules
- **Icons:** Lucide React
- **PDF & Canvas:** `jspdf` & `html2canvas`
- **Data Layer:** Browser LocalStorage with schema versioning and JSON export/import

---

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18 or newer)
- npm or bun

### Installation
```bash
# Clone the repository
git clone <repo-url>
cd quickinvoice

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run preview
```

---

## 📁 Project Architecture

```
src/
├── types/
│   └── invoice.ts              # Data contracts for invoices, items, profiles, payments, settings
├── utils/
│   ├── currency.ts             # Currency symbols, locale formatting, and amount-in-words converter
│   ├── calculations.ts         # Arithmetic calculations for subtotal, taxes, GST, discounts, and balances
│   ├── storage.ts              # LocalStorage sync, sample demo data, JSON backup/restore
│   └── pdf.ts                  # PDF generation & print triggers
├── components/
│   ├── Navbar.tsx              # Top navigation, status indicator, and quick actions
│   ├── common/
│   │   ├── Badge.tsx           # Status badge for Paid, Partially Paid, Unpaid, Overdue, Draft
│   │   └── Toast.tsx           # Floating toast notification system
│   ├── Dashboard/
│   │   ├── DashboardView.tsx   # Financial overview, metric cards, status progress, recent invoices
│   │   └── StatCard.tsx        # Reusable metric card
│   ├── InvoiceEditor/
│   │   ├── InvoiceEditor.tsx   # Split view controller and toolbar
│   │   ├── BusinessSection.tsx # Seller profile and logo upload
│   │   ├── ClientSection.tsx   # Client billing details
│   │   ├── InvoiceMetaSection.tsx # Numbers, dates, presets, and currency
│   │   ├── LineItemsSection.tsx# Dynamic product and service rows
│   │   ├── TaxDiscountSection.tsx # GST / Standard Tax / Discounts / Charges
│   │   └── NotesTermsSection.tsx # Bank details, UPI, terms & signatory
│   ├── InvoicePreview/
│   │   ├── InvoicePreview.tsx  # Pixel-perfect A4 invoice document preview
│   │   └── TemplateSelector.tsx# Accent colors and display switches
│   ├── InvoiceHistory/
│   │   ├── InvoiceHistoryView.tsx # Searchable, filterable invoice data table
│   │   ├── RecordPaymentModal.tsx # Payment logger modal with balance tracking
│   │   └── DeleteConfirmModal.tsx # Confirmation dialog for safe deletion
│   └── Settings/
│       └── SettingsView.tsx    # Default preferences, business profile, and JSON backup
├── App.tsx                     # Main application orchestrator
├── index.css                   # Global styles and @media print definitions
└── main.tsx                    # React DOM entry point
```

---

## 🔒 Privacy & Limitations

- **Browser Storage:** Data is stored locally in the user's browser. If the user clears their browser cache or uses private/incognito mode, data will not persist after the session. Use the **Export Backup** feature in Settings to archive records.
- **Client-Side Generation:** PDF conversion runs directly on the client machine using canvas rasterization; complex custom external fonts should be loaded with CORS headers.

---

## 🔮 Future Enhancements
- Recurring invoice reminders via browser Web Push or mailto templates.
- Multi-language invoice templates (Spanish, French, German, Hindi).
- Direct WhatsApp sharing link with pre-filled payment request text.
- Barcode and QR code generation for e-invoicing compliance (B2B).
