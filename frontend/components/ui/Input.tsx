// frontend/components/ui/Input.tsx
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export default function Input({ className = '', ...props }: InputProps) {
  const baseClasses = "p-3 border-2 border-blue-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200 font-gowun text-gray-800";
  return (
    <input className={`${baseClasses} ${className}`} {...props} />
  );
}
