import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Card as UICard
} from '../ui/card';

// Omit the native HTML 'title' attribute so we can use a ReactNode title prop
export type CardBaseProps = Omit<React.ComponentPropsWithoutRef<typeof UICard>, 'title'>;

export interface CardProps extends CardBaseProps {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  onTitleClick?: () => void;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ icon, title, description, footer, children, className, onTitleClick, ...props }, ref) => (
    <UICard ref={ref} className={cn(className, 'bg-white')} {...props}>
      {(icon || title || description) && (
        <CardHeader>
          {(icon || title) && (
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              {icon && <>{icon}</>}
              {title && onTitleClick ? (
                <button type="submit" onClick={onTitleClick}>
                  <h4>{title}</h4>
                </button>
              ) : (
                <h4>{title}</h4>
              )}
            </CardTitle>
          )}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}

      {children && <CardContent className="flex-1 min-h-0 overflow-auto">{children}</CardContent>}

      {footer && <CardFooter>{footer}</CardFooter>}
    </UICard>
  )
);

Card.displayName = 'Card';

export default Card;
