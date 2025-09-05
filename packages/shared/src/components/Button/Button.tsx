import type * as React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps {
  variant?: 'solid' | 'outline';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'solid',
  children,
  onClick,
  className = ''
}) => {
  const baseClasses =
    'px-[1.125rem] py-[0.5625rem] rounded-[1.75rem] border border-primary-500 font-semibold transition-colors duration-200 focus:outline-none';

  const variantClasses = {
    solid: 'bg-primary-500 hover:bg-white text-white hover:text-primary-600 w-fit',
    outline: 'bg-white hover:bg-primary-500 text-primary-500 hover:text-white'
  };

  return (
    <button
      type="button"
      className={cn(baseClasses, variantClasses[variant], className)}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
