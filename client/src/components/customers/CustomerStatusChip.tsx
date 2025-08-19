import React from 'react';
import Badge from '../ui/Badge';
import { CustomerStatus } from '../../types';

interface CustomerStatusChipProps {
  status: CustomerStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const CustomerStatusChip: React.FC<CustomerStatusChipProps> = ({
  status,
  size = 'sm',
  className = '',
}) => {
  // Status configuration
  const statusConfig = {
    active: {
      label: 'Active',
      color: 'green' as const,
    },
    pending: {
      label: 'Pending',
      color: 'yellow' as const,
    },
    inactive: {
      label: 'Inactive',
      color: 'gray' as const,
    },
    suspended: {
      label: 'Suspended',
      color: 'red' as const,
    },
  };

  const config = statusConfig[status] || statusConfig.inactive;

  return (
    <Badge
      color={config.color}
      size={size}
      className={`min-w-[80px] justify-center ${className}`}
    >
      {config.label}
    </Badge>
  );
};

export default CustomerStatusChip;