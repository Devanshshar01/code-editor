import type { SelectHTMLAttributes } from 'react';
import { cn } from '../../utils';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{ value: string; label: string }>;
}

export function Select({ options, className, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        'bg-gray-800 text-gray-200 text-sm rounded px-3 py-1.5 border border-gray-700',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        'hover:bg-gray-750 transition-colors cursor-pointer',
        className
      )}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
