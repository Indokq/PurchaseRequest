import React from 'react';
import { Badge } from '../../../shared/components';
import type { PurchaseRequestStatus } from '../../../shared/types';

interface StatusBadgeProps {
  status: PurchaseRequestStatus | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getVariant = (): 'success' | 'warning' | 'danger' | 'secondary' | 'primary' => {
    switch (status) {
      case 'Draft':
        return 'secondary';
      case 'Submitted':
        return 'primary';
      case 'InApproval':
        return 'warning';
      case 'Approved':
        return 'success';
      case 'Rejected':
        return 'danger';
      case 'Completed':
      case 'Cancelled':
      default:
        return 'secondary';
    }
  };

  return (
    <Badge variant={getVariant()} className={className}>
      {status}
    </Badge>
  );
};
