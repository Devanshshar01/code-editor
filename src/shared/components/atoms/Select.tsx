import type { SelectHTMLAttributes } from 'react';
import { cn } from '../../utils';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{ value: string; label: string }>;
}

export function Select({ options, className, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        'bg-[#3c3c3c] text-[#cccccc] text-xs rounded px-1.5 py-0.5 border border-[#0000004d]',
        'focus:outline-none focus:ring-1 focus:ring-[#007acc] focus:border-[#007acc]',
        'hover:bg-[#ffffff1a] transition-colors cursor-pointer',
        className
      )}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value} className="bg-[#3c3c3c]">
          {option.label}
        </option>
      ))}
    </select>
  );
}