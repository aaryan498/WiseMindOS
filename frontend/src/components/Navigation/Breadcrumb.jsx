import React from 'react';
import { ChevronRight } from 'lucide-react';

const Breadcrumb = ({ items = [], onNavigate }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="pb-2">
      <ol className="flex items-center space-x-2 text-xs font-medium text-gray-500 dark:text-gray-400">
        <li>
          <button
            onClick={() => onNavigate('/')}
            className="hover:text-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 cursor-pointer"
          >
            Dashboard
          </button>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              <span className="text-gray-400 select-none" aria-hidden="true">/</span>
              <li>
                {isLast ? (
                  <span className="text-gray-700 dark:text-gray-200 font-semibold" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <button
                    onClick={() => onNavigate(item.path)}
                    className="hover:text-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 cursor-pointer"
                  >
                    {item.label}
                  </button>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
