import React from 'react';
import { InvoiceStatus } from '../../types/invoice';

interface BadgeProps {
  status: InvoiceStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<BadgeProps> = ({ status, size = 'md', className = '' }) => {
  const configs: Record<InvoiceStatus, { label: string; bg: string; text: string; dot: string; border: string }> = {
    paid: {
      label: 'Paid',
      bg: 'bg-emerald-50/90',
      text: 'text-emerald-800',
      border: 'border-emerald-200/90',
      dot: 'bg-emerald-600',
    },
    partially_paid: {
      label: 'Partially Paid',
      bg: 'bg-orange-50/90',
      text: 'text-orange-900',
      border: 'border-orange-200/90',
      dot: 'bg-orange-500',
    },
    unpaid: {
      label: 'Unpaid',
      bg: 'bg-amber-50/90',
      text: 'text-amber-900',
      border: 'border-amber-200/90',
      dot: 'bg-amber-500',
    },
    overdue: {
      label: 'Overdue',
      bg: 'bg-rose-50/90',
      text: 'text-rose-900',
      border: 'border-rose-200/90',
      dot: 'bg-rose-500',
    },
    draft: {
      label: 'Draft',
      bg: 'bg-stone-100',
      text: 'text-stone-700',
      border: 'border-stone-200',
      dot: 'bg-stone-400',
    },
  };

  const config = configs[status] || configs.draft;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-semibold',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 font-bold',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border shadow-xs ${config.bg} ${config.text} ${config.border} ${sizeClasses} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
};
