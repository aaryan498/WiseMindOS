import React from 'react';

const GradientButton = ({ 
  children, 
  onClick, 
  className = '', 
  type = 'button', 
  disabled = false 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative overflow-hidden inline-flex items-center justify-center gap-2
        bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600
        bg-[length:200%_auto] bg-[position:left_center]
        text-white font-semibold py-3 px-6 rounded-xl
        shadow-lg shadow-indigo-600/20
        
        /* Interactive Micro-Interactions */
        transition-all duration-300 ease-out select-none cursor-pointer
        hover:bg-[position:right_center] hover:shadow-[0_8px_24px_rgba(99,102,241,0.5)] hover:-translate-y-0.5
        active:scale-95 active:translate-y-0
        
        /* Accessibility Focus States */
        outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
        
        /* Guardrails for Disabled States */
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
        
        ${className}
      `}
    >
      {/* Container wrapper to maintain element layout positioning over background layers */}
      <span className="relative z-10 flex items-center justify-center gap-2 tracking-wide text-sm font-bold">
        {children}
      </span>
    </button>
  );
};

export default GradientButton;