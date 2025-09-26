/** biome-ignore-all lint/correctness/useUniqueElementIds: is is being used statically */

import { ScrollArea } from '@ui/scroll-area';
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
  headerTestId?: string;
  titleTestId?: string;
  descriptionTestId?: string;
  footerTestId?: string;
  contentTestId?: string;
  cardContentClassName?: string;
  disableScrollArea?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      icon,
      title,
      description,
      footer,
      children,
      className,
      onTitleClick,
      headerTestId,
      titleTestId,
      descriptionTestId,
      footerTestId,
      contentTestId,
      cardContentClassName,
      disableScrollArea = false,
      ...props
    },
    ref
  ) => (
    <UICard ref={ref} className={cn(className, 'bg-white')} {...props}>
      {(icon || title || description) && (
        <CardHeader data-testid={headerTestId} className="p-6 pb-0">
          {(icon || title) && (
            <CardTitle
              className="flex items-center gap-2 text-xl font-bold"
              data-testid={titleTestId}
            >
              {icon && <>{icon}</>}
              {title && onTitleClick ? (
                <button type="submit" onClick={onTitleClick}>
                  <h4 className="text-left leading-tight">{title}</h4>
                </button>
              ) : (
                <h4 className="text-left leading-tight">{title}</h4>
              )}
            </CardTitle>
          )}
          {description && (
            <CardDescription data-testid={descriptionTestId}>{description}</CardDescription>
          )}
        </CardHeader>
      )}

      {children && (
        <CardContent
          className={cn(
            `flex-1 min-h-0 flex flex-col p-6 pt-0 overflow-hidden`,
            cardContentClassName
          )}
          data-testid={contentTestId}
        >
          {disableScrollArea ? (
            <div className="flex flex-1 min-h-0 flex-col gap-4 min-w-max">{children}</div>
          ) : (
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-4 min-w-max">{children}</div>
            </ScrollArea>
          )}
        </CardContent>
      )}

      {footer && <CardFooter data-testid={footerTestId}>{footer}</CardFooter>}
    </UICard>
  )
);

Card.displayName = 'Card';

export default Card;
