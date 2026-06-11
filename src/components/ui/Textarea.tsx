'use client';

import { cn } from '@/lib/utils';
import { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  id: string;
}

export default function Textarea({
  label,
  error,
  id,
  className,
  ...props
}: TextareaProps) {
  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1.5"
      >
        {label}
      </label>
      <textarea
        id={id}
        rows={4}
        className={cn(
          'w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent resize-y disabled:bg-gray-100 disabled:cursor-not-allowed',
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
