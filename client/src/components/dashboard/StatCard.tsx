import React from 'react';
import { Box, Typography, Card, CardContent, SvgIcon, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import { ReactElement } from 'react';

const StatCardRoot = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const TrendIndicator = styled('span')<{ trend: number }>(({ theme, trend }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  color: trend >= 0 ? theme.palette.success.main : theme.palette.error.main,
  fontSize: '0.875rem',
  fontWeight: 500,
  '& svg': {
    marginRight: 2,
    fontSize: '1rem',
  },
}));

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactElement;
  color?: string;
  trend?: number;
  prefix?: string;
  suffix?: string;
  sx?: SxProps;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  trend,
  prefix = '',
  suffix = '',
  sx = {},
}) => {
  const theme = useTheme();
  const trendValue = trend !== undefined ? trend : 0;
  const trendIcon = trendValue >= 0 ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 15L12 8L16 12L19 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19 9H15.5M19 9V12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 9L12 16L8 12L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 15H8.5M5 15V11.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  return (
    <StatCardRoot sx={sx}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: 500,
              fontSize: '0.75rem',
            }}
          >
            {title}
          </Typography>
          <Box
            sx={{
              backgroundColor: color ? `${color}15` : 'action.hover',
              color: color || 'primary.main',
              borderRadius: '12px',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '& svg': {
                fontSize: '1.25rem',
              },
            }}
          >
            {React.cloneElement(icon, { style: { color: color || theme.palette.primary.main } })}
          </Box>
        </Box>
        
        <Box display="flex" alignItems="flex-end" flexWrap="wrap">
          <Typography
            variant="h4"
            component="div"
            sx={{
              fontWeight: 600,
              lineHeight: 1.2,
              mr: 1,
              color: 'text.primary',
            }}
          >
            {prefix}{value}
          </Typography>
          {suffix && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 0.5,
                fontSize: '0.875rem',
              }}
            >
              {suffix}
            </Typography>
          )}
        </Box>
        
        {trend !== undefined && (
          <Box mt={1.5} display="flex" alignItems="center">
            <TrendIndicator trend={trend}>
              {trendIcon}
              {Math.abs(trendValue)}%
            </TrendIndicator>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                ml: 1,
                fontSize: '0.75rem',
              }}
            >
              vs last month
            </Typography>
          </Box>
        )}
      </CardContent>
    </StatCardRoot>
  );
};

export default StatCard;
