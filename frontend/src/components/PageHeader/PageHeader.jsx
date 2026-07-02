import React from 'react';

const PageHeader = ({
  title,
  description,
  ctaLabel,
  ctaOnClick,
  secondaryLabel,
  secondaryOnClick
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800 mb-6">
      <div className="flex-1">
        <h1 className="text-2xs font-bold text-slate-900 dark:text-white leading-tight" style={{ fontSize: '28px' }}>
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
      
      <div className="flex items-center gap-3 self-start md:self-center">
        {secondaryLabel && secondaryOnClick && (
          <button
            type="button"
            onClick={secondaryOnClick}
            className="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer"
          >
            {secondaryLabel}
          </button>
        )}
        
        {ctaLabel && ctaOnClick && (
          <button
            type="button"
            onClick={ctaOnClick}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer"
          >
            {ctaLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
