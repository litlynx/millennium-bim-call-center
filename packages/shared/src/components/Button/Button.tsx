import { cn } from '@/lib/utils';
import type * as React from 'react';

export interface ButtonProps {
  variant?: 'solid' | 'outline' | 'light';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'solid',
  children,
  onClick,
  className = '',
  size = 'md'
}) => {
  const baseClasses =
    'px-[1.125rem] py-[0.5625rem] rounded-[1.75rem] border border-primary-500 font-semibold transition-colors duration-200 focus:outline-none';

  const variantClasses = {
    solid: 'bg-primary-500 hover:bg-white text-white hover:text-primary-600 w-fit',
    outline: 'bg-white hover:bg-primary-500 text-primary-500 hover:text-white',
    light: 'border-0 bg-primary-50 hover:bg-primary-500 text-primary-500 hover:text-white'
  };
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-md',
    lg: 'text-[22px]'
  };

  return (
    <button
      type="button"
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
