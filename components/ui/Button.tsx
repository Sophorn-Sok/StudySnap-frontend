'use client';

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className,
  ...props
}: ButtonProps) => {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-[0_8px_20px_-6px_rgba(37,99,235,0.35)] border border-blue-600',
    secondary: 'bg-gray-100/80 text-gray-700 hover:bg-gray-200 disabled:bg-gray-50 border border-transparent',
    danger: 'bg-red-500 text-white hover:bg-red-600 border border-red-500 shadow-[0_8px_20px_-6px_rgba(239,68,68,0.35)]',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 disabled:bg-transparent border border-transparent',
    outline: 'bg-white border border-gray-100 text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md'
  };

  const sizes = {
    sm: 'h-10 px-5 text-xs',
    md: 'h-12 px-7 text-[14px]',
    lg: 'h-16 px-10 text-[16px]',
  };

  return (
    <button
      className={cn(
        'font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2.5 whitespace-nowrap shrink-0 tracking-tight active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : children}
    </button>
  );
};
