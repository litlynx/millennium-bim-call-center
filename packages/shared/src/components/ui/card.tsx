import * as React from 'react';

import { cn } from '@/lib/utils';

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-xl bg-card text-card-foreground flex flex-col overflow-hidden h-full',
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
<<<<<<< HEAD
    <div ref={ref} className={cn('flex flex-col space-y-1.5 pb-5', className)} {...props} />
=======
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 pb-5', className)}
      {...props}
    />
>>>>>>> e296639 ([sc-27] vision 360 personal data (#19))
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
  )
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    // biome-ignore lint/correctness/useUniqueElementIds: id needed here
<<<<<<< HEAD
    <div ref={ref} id="card-content" className={cn('', className)} {...props} />
=======
    <div
      ref={ref}
      id="card-content"
      className={cn('has-[#scroll-bar]:pr-[0.5625rem]', className)}
      {...props}
    />
>>>>>>> e296639 ([sc-27] vision 360 personal data (#19))
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
<<<<<<< HEAD
=======

>>>>>>> e296639 ([sc-27] vision 360 personal data (#19))
