export interface CurrencyOption {
  code: string;
  symbol: string;
  label: string;
  locale: string;
}

export const SUPPORTED_CURRENCIES: CurrencyOption[] = [
  { code: 'INR', symbol: '₹', label: 'Indian Rupee (INR - ₹)', locale: 'en-IN' },
  { code: 'USD', symbol: '$', label: 'US Dollar (USD - $)', locale: 'en-US' },
  { code: 'EUR', symbol: '€', label: 'Euro (EUR - €)', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', label: 'British Pound (GBP - £)', locale: 'en-GB' },
  { code: 'CAD', symbol: 'CA$', label: 'Canadian Dollar (CAD - CA$)', locale: 'en-CA' },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar (AUD - A$)', locale: 'en-AU' },
  { code: 'AED', symbol: 'AED', label: 'UAE Dirham (AED)', locale: 'en-AE' },
  { code: 'SGD', symbol: 'S$', label: 'Singapore Dollar (SGD - S$)', locale: 'en-SG' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen (JPY - ¥)', locale: 'ja-JP' },
];

/**
 * Format a numeric amount using currency code or symbol
 */
export function formatCurrency(amount: number, currencyCode: string = 'INR', customSymbol?: string): string {
  const num = isNaN(amount) ? 0 : amount;
  const curr = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode) || SUPPORTED_CURRENCIES[0];
  const symbol = customSymbol || curr.symbol;
  
  try {
    const formattedNum = new Intl.NumberFormat(curr.locale, {
      minimumFractionDigits: curr.code === 'JPY' ? 0 : 2,
      maximumFractionDigits: curr.code === 'JPY' ? 0 : 2,
    }).format(num);

    // If custom symbol or standard symbol
    return `${symbol} ${formattedNum}`;
  } catch {
    return `${symbol} ${num.toFixed(2)}`;
  }
}

/**
 * Convert number into human words (supports standard English numbering with rupees / dollars fallback)
 */
export function amountInWords(amount: number, currencyCode: string = 'INR'): string {
  if (isNaN(amount) || amount <= 0) return 'Zero';

  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 
                 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const whole = Math.floor(amount);
  const decimal = Math.round((amount - whole) * 100);

  function convertSmall(n: number): string {
    if (n === 0) return '';
    if (n < 20) return units[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + units[n % 10] : '');
    return units[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + convertSmall(n % 100) : '');
  }

  let words = '';

  if (currencyCode === 'INR') {
    // Indian numbering system: Crores, Lakhs, Thousands, Hundreds
    let n = whole;
    const crore = Math.floor(n / 10000000);
    n %= 10000000;
    const lakh = Math.floor(n / 100000);
    n %= 100000;
    const thousand = Math.floor(n / 1000);
    n %= 1000;
    const remainder = n;

    if (crore > 0) words += convertSmall(crore) + ' Crore ';
    if (lakh > 0) words += convertSmall(lakh) + ' Lakh ';
    if (thousand > 0) words += convertSmall(thousand) + ' Thousand ';
    if (remainder > 0) words += convertSmall(remainder);

    words = words.trim() + ' Rupees';
    if (decimal > 0) {
      words += ' and ' + convertSmall(decimal) + ' Paise';
    }
    words += ' Only';
  } else {
    // Western numbering system: Millions, Thousands
    let n = whole;
    const million = Math.floor(n / 1000000);
    n %= 1000000;
    const thousand = Math.floor(n / 1000);
    n %= 1000;
    const remainder = n;

    if (million > 0) words += convertSmall(million) + ' Million ';
    if (thousand > 0) words += convertSmall(thousand) + ' Thousand ';
    if (remainder > 0) words += convertSmall(remainder);

    words = words.trim();
    if (decimal > 0) {
      words += ` and ${decimal}/100`;
    }
    words += ' Only';
  }

  return words.trim();
}
