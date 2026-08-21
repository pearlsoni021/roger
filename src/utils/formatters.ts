/**
 * Indian Rupee and Financial Formatting Utilities
 */

export function formatINR(amount: number, options: { compact?: boolean; showDecimals?: boolean } = {}): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0';
  }

  const { compact = false, showDecimals = false } = options;
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  if (compact) {
    if (absAmount >= 10000000) {
      // Crores
      const cr = (absAmount / 10000000).toFixed(2);
      return `${isNegative ? '-' : ''}₹${cr} Cr`;
    } else if (absAmount >= 100000) {
      // Lakhs
      const lk = (absAmount / 100000).toFixed(2);
      return `${isNegative ? '-' : ''}₹${lk} L`;
    } else if (absAmount >= 1000) {
      // Thousands
      const k = (absAmount / 1000).toFixed(1);
      return `${isNegative ? '-' : ''}₹${k}k`;
    }
  }

  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: showDecimals ? 2 : 0,
    minimumFractionDigits: showDecimals ? 2 : 0,
  }).format(absAmount);

  return `${isNegative ? '-' : ''}₹${formatted}`;
}

export function formatPercent(value: number, decimals: number = 1): string {
  if (isNaN(value)) return '0%';
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
}
