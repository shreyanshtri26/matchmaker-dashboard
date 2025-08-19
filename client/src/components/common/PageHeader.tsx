import React, { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  titleSize?: 'sm' | 'md' | 'lg' | 'xl';
  divider?: boolean;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  action,
  titleSize = 'lg',
  divider = true,
  className = '',
}) => {
  const titleSizeClasses = {
    sm: 'text-xl sm:text-2xl',
    md: 'text-2xl sm:text-3xl',
    lg: 'text-3xl sm:text-4xl',
    xl: 'text-4xl sm:text-5xl',
  };

  return (
    <div className={`mb-6 sm:mb-8 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <h1 className={`font-semibold text-gray-900 ${titleSizeClasses[titleSize]} ${subtitle ? 'mb-2' : ''}`}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-600 leading-relaxed max-w-3xl">
              {subtitle}
            </p>
          )}
        </div>
        
        {action && (
          <div className="flex-shrink-0 w-full sm:w-auto">
            {action}
          </div>
        )}
      </div>
      
      {divider && (
        <div className="mt-6 border-b border-gray-200" />
      )}
    </div>
  );
};

export default PageHeader;