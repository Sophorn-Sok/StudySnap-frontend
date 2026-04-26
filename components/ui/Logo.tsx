'use client';

import React from 'react';
import { Boxes } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'dark' | 'light';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  variant = 'dark', 
  className = '',
  showText = true 
}) => {
  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
    '2xl': 'text-5xl',
  };

  const iconWrapperSizes = {
    sm: 'p-1 rounded-lg',
    md: 'p-1.5 rounded-xl',
    lg: 'p-2 rounded-xl',
    xl: 'p-2.5 rounded-2xl',
    '2xl': 'p-3 rounded-2xl',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 28,
    xl: 36,
    '2xl': 48,
  };

  const colorClass = variant === 'light' ? 'text-white' : 'text-slate-900 dark:text-white';

  return (
    <div className={`flex items-center gap-3 font-bold select-none group ${className}`}>
      <div className={`
        bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600 
        shadow-lg shadow-blue-500/20 
        transition-all duration-500 group-hover:scale-110 group-hover:rotate-6
        flex items-center justify-center
        ${iconWrapperSizes[size]}
      `}>
        <Boxes size={iconSizes[size]} className="text-white" />
      </div>
      {showText && (
        <span className={`${sizes[size]} ${colorClass} font-serif transition-colors duration-300`}>
          VICHEA
        </span>
      )}
    </div>
  );
};
