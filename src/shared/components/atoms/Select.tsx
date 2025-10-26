import type { SelectHTMLAttributes } from 'react';
import { cn } from '../../utils';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{ value: string; label: string }>;
}

export function Select({ options, className, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        'bg-[#3c3c3c] text-[#cccccc] text-sm rounded px-2 py-1 border border-[#3c3c3c]',
        'focus:outline-none focus:ring-1 focus:ring-[#007acc] focus:border-[#007acc]',
        'hover:bg-[#464647] transition-colors cursor-pointer',
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
