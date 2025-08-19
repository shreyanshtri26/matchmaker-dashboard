import React, { ReactElement } from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactElement;
  color?: string;
  trend?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color = '#3b82f6', // default blue
  trend,
  prefix = '',
  suffix = '',
  className = '',
}) => {
  const trendValue = trend !== undefined ? trend : 0;
  const isPositiveTrend = trendValue >= 0;

  const TrendIcon = ({ positive }: { positive: boolean }) => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {positive ? (
        <path d="M5 15L12 8L16 12L19 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      ) : (
        <path d="M19 9L12 16L8 12L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      )}
      {positive && <path d="M19 9H15.5M19 9V12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>}
      {!positive && <path d="M5 15H8.5M5 15V11.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>}
    </svg>
  );

  return (
    <div className={`bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-1 p-6 h-full ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          {title}
        </h3>
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ 
            backgroundColor: `${color}15`,
            color: color 
          }}
        >
          {React.cloneElement(icon, { className: 'w-5 h-5' })}
        </div>
      </div>
      
      <div className="flex items-baseline flex-wrap gap-1 mb-3">
        <span className="text-3xl font-semibold text-gray-900 leading-tight">
          {prefix}{value}
        </span>
        {suffix && (
          <span className="text-sm text-gray-500 font-medium">
            {suffix}
          </span>
        )}
      </div>
      
      {trend !== undefined && (
        <div className="flex items-center gap-1">
          <span className={`inline-flex items-center gap-1 text-sm font-medium ${
            isPositiveTrend ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendIcon positive={isPositiveTrend} />
            {Math.abs(trendValue)}%
          </span>
          <span className="text-xs text-gray-500">
            vs last month
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;