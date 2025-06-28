// frontend/components/ui/Select.tsx
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
}

export default function Select({ className = '', children, ...props }: SelectProps) {
  const baseClasses = "p-3 border-2 border-blue-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200 font-gowun text-gray-800 appearance-none bg-white pr-8"; // appearance-none과 pr-8로 기본 화살표 숨기고 패딩
  return (
    <div className="relative w-full">
      <select className={`${baseClasses} ${className}`} {...props}>
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
    </div>
  );
}
