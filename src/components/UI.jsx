import React from 'react';

export const Card = ({ children, title, subtitle, className = "" }) => (
  <div className={`glass-card p-6 ${className}`}>
    {(title || subtitle) && (
      <div className="mb-4">
        {title && <h3 className="text-lg font-semibold">{title}</h3>}
        {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
      </div>
    )}
    {children}
  </div>
);

export const Button = ({ children, variant = 'primary', className = "", ...props }) => {
  const variants = {
    primary: 'jupiter-gradient text-white jupiter-glow hover:opacity-90',
    secondary: 'bg-white/5 text-white hover:bg-white/10 border border-white/10',
    outline: 'border border-jupiter-500/50 text-jupiter-400 hover:bg-jupiter-500/5',
  };

  return (
    <button
      className={`px-4 py-2 rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Badge = ({ children, variant = 'info' }) => {
  const variants = {
    success: 'bg-green-500/10 text-green-400 border-green-500/20',
    warning: 'bg-jupiter-500/10 text-jupiter-400 border-jupiter-500/20',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    danger: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium border ${variants[variant]}`}>
      {children}
    </span>
  );
};
