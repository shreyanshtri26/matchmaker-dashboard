import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
} from 'recharts';
import { SxProps } from '@mui/system';

interface TrendData {
  month: string;
  matches: number;
  successRate: number;
}

interface MatchSuccessRateProps {
  data: TrendData[];
  sx?: SxProps;
}
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          p: 1.5,
          boxShadow: 1,
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          {label}
        </Typography>
        <Box>
          <Box display="flex" justifyContent="space-between" mb={0.5}>
            <Typography component="span" variant="caption" color="text.secondary">
              Matches:
            </Typography>
            <Typography component="span" variant="caption" fontWeight={500}>
              {payload[0].payload.matches}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography component="span" variant="caption" color="text.secondary">
              Success Rate:
            </Typography>
            <Typography 
              component="span" 
              variant="caption" 
              fontWeight={500}
              sx={{ color: 'success.main' }}
            >
              {payload[0].payload.successRate}%
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }
  return null;
};

const MatchSuccessRate: React.FC<MatchSuccessRateProps> = ({ data, sx = {} }) => {
  const theme = useTheme();

  // Format data for the chart
  const chartData = [...data].sort((a, b) => 
    new Date(a.month).getTime() - new Date(b.month).getTime()
  );

  // Format month labels to short month names
  const formatMonth = (month: string) => {
    const date = new Date(month);
    return date.toLocaleString('default', { month: 'short' });
  };

  // Calculate min and max for Y-axis with some padding
  const successRates = data.map(item => item.successRate);
  const minRate = Math.max(0, Math.min(...successRates) - 5);
  const maxRate = Math.min(100, Math.max(...successRates) + 5);

  return (
    <Box sx={{ width: '100%', height: '100%', ...sx }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 10,
            bottom: 30,
          }}
        >
          <defs>
            <linearGradient id="colorSuccessRate" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={theme.palette.success.main} stopOpacity={0.2} />
              <stop offset="95%" stopColor={theme.palette.success.main} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false}
            stroke={theme.palette.divider}
          />
          <XAxis 
            dataKey="month" 
            tickFormatter={formatMonth}
            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis 
            domain={[minRate, maxRate]}
            tickFormatter={(value) => `${value}%`}
            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            width={40}
          >
            <Label
              value="Success Rate"
              angle={-90}
              position="insideLeft"
              style={{ 
                textAnchor: 'middle',
                fill: theme.palette.text.secondary,
                fontSize: 12,
              }}
            />
          </YAxis>
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ stroke: theme.palette.divider, strokeWidth: 1 }}
            wrapperStyle={{ zIndex: 10 }}
          />
          <Area
            type="monotone"
            dataKey="successRate"
            name="Success Rate"
            stroke={theme.palette.success.main}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorSuccessRate)"
            activeDot={{
              r: 6,
              fill: theme.palette.success.main,
              stroke: theme.palette.background.paper,
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default MatchSuccessRate;
