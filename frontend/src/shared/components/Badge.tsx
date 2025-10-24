import React from 'react';

export interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'secondary' | 'primary';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'secondary', children, className = '' }: BadgeProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'bg-emerald-100 text-emerald-800';
      case 'warning':
        return 'bg-amber-100 text-amber-800';
      case 'danger':
        return 'bg-rose-100 text-rose-800';
      case 'primary':
        return 'bg-primary/20 text-primary';
      case 'secondary':
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getVariantStyles()} ${className}`}
    >
      {children}
    </span>
  );
}
