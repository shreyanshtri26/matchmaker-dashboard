import React from 'react';
import { Chip, ChipProps, useTheme } from '@mui/material';
import { CustomerStatus } from '../../types';

interface CustomerStatusChipProps extends Omit<ChipProps, 'label' | 'color'> {
  status: CustomerStatus;
  size?: 'small' | 'medium';
}

const CustomerStatusChip: React.FC<CustomerStatusChipProps> = ({
  status,
  size = 'small',
  ...props
}) => {
  const theme = useTheme();
  
  // Status configuration
  const statusConfig = {
    active: {
      label: 'Active',
      color: 'success',
      bgColor: theme.palette.success.light,
      textColor: theme.palette.success.dark,
    },
    pending: {
      label: 'Pending',
      color: 'warning',
      bgColor: theme.palette.warning.light,
      textColor: theme.palette.warning.dark,
    },
    inactive: {
      label: 'Inactive',
      color: 'default',
      bgColor: theme.palette.grey[300],
      textColor: theme.palette.grey[800],
    },
    suspended: {
      label: 'Suspended',
      color: 'error',
      bgColor: theme.palette.error.light,
      textColor: theme.palette.error.dark,
    },
  };

  const config = statusConfig[status] || statusConfig.inactive;

  return (
    <Chip
      label={config.label}
      size={size}
      sx={{
        backgroundColor: config.bgColor,
        color: config.textColor,
        fontWeight: 500,
        minWidth: 80,
        '& .MuiChip-label': {
          px: 1,
        },
        ...props.sx,
      }}
      {...props}
    />
  );
};

export default CustomerStatusChip;
