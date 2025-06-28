
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  primary?: boolean;
  secondary?: boolean;
  className?: string;
}

export default function Button({ children, primary, secondary, className = '', ...props }: ButtonProps) {
  const baseClasses = "px-6 py-3 rounded-full font-bold text-lg transition-all duration-300 shadow-md hover:shadow-lg";
  const primaryClasses = "bg-purple-500 text-white hover:bg-purple-600 border border-purple-600";
  const secondaryClasses = "bg-green-500 text-white hover:bg-green-600 border border-green-600";
  const defaultClasses = "bg-gray-200 text-gray-700 hover:bg-gray-300 border border-gray-300";

  const buttonClasses = `${baseClasses} ${primary ? primaryClasses : secondary ? secondaryClasses : defaultClasses} ${className}`;

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
}
