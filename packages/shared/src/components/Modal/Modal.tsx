import type * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';

export interface ModalProps {
  children: React.ReactNode;
  trigger?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  icon?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl'
};

const Modal: React.FC<ModalProps> = ({
  children,
  trigger,
  title,
  description,
  footer,
  icon,
  isOpen,
  onOpenChange,
  className,
  headerClassName,
  contentClassName,
  footerClassName,
  size = 'md'
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className={cn(sizeClasses[size], className)} hideCloseButton>
        {(icon || title || description) && (
          <DialogHeader className={cn('space-y-10', headerClassName)}>
            {(icon || title) && (
              <div className="flex items-center gap-3">
                {icon && <div className="flex-shrink-0">{icon}</div>}
                {title && <DialogTitle className="flex-1">{title}</DialogTitle>}
              </div>
            )}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}

        <div className={cn('py-4', contentClassName)}>{children}</div>

        {footer && <DialogFooter className={cn('pt-4', footerClassName)}>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
};

Modal.displayName = 'Modal';

export default Modal;
