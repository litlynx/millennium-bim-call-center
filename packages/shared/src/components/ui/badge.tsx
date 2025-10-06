import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-lg border px-2.5 text-3xs leading-3 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 w-fit shrink-0',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary-500 text-white shadow hover:bg-primary/80 rounded-[11px]',
        active: 'border-transparent bg-green text-white hover:bg-green/80 rounded-[11px]',
        inactive:
          'border-transparent bg-red-500 text-white shadow hover:bg-red-500/80 rounded-[11px]',
        blocked:
          'border-transparent bg-orange-500 text-white shadow hover:bg-orange-500/80 rounded-[11px]',
        white: 'border-transparent bg-white rounded-[11px] text-green',
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
