import type { ReactNode } from 'react';
import Icon from '@/components/Icon';
import { cn } from '@/lib/utils';

interface ScriptsDetailsProps {
  title: string;
  children?: ReactNode;
  headerClassName?: string;
  bodyClassName?: string;
  className?: string;
}

export default function ScriptsDetails({
  title,
  children,
  headerClassName = '',
  bodyClassName = '',
  className = ''
}: ScriptsDetailsProps) {
  return (
    <article
      className={cn(`rounded-[20px] bg-white shadow-sm border overflow-auto h-full`, className)}
    >
      <header
        className={cn(
          `bg-gray-200 pl-[1.6875rem] pr-[1.241875rem] min-h-[43px] border-b border-primary flex items-center justify-between`,
          headerClassName
        )}
      >
        <h3 className="font-bold text-gray-800">{title}</h3>
        <div className="flex items-center gap-2" role="toolbar" aria-label="Window controls">
          <button type="button" aria-label="Minimize window">
            <Icon type="minify" className="h-4" />
          </button>
          <button type="button" aria-label="Maximize window">
            <Icon type="maximize" className="h-4" />
          </button>
        </div>
      </header>

      <main className={cn(`p-[1.6875rem]`, bodyClassName)}>{children}</main>
    </article>
  );
}
