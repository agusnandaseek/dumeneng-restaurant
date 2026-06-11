'use client';

import { cn } from '@/lib/utils';
import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  id: string;
}

export default function Input({
  label,
  error,
  id,
  className,
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1.5"
      >
        {label}
      </label>
      <input
        id={id}
        className={cn(
          'w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed min-h-[44px]',
          error &&
            'border-red-400 focus:ring-red-400',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
