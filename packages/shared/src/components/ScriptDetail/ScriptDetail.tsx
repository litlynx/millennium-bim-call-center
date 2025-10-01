import type { ReactNode } from 'react';
import { useCallback } from 'react';
import Icon from '@/components/Icon';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage
} from '@/components/ui';
import { cn } from '@/lib/utils';
import { useNavigationStore } from '@/stores';

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
  const breadcrumbs = useNavigationStore((state) => state.currentBreadcrumbs);

  const handleBreadcrumbClick = useCallback((path: string) => {
    if (typeof window === 'undefined') return;

    window.microFrontendNavigation?.navigateTo?.(path);
  }, []);

  const hasBreadcrumbs = breadcrumbs.length > 0;

  return (
    <article
      className={cn(`rounded-[20px] bg-white shadow-sm border overflow-auto h-full`, className)}
    >
      <header
        className={cn(
          `bg-gray-200 pl-[1.6875rem] pr-[1.241875rem] min-h-[43px] border-b border-primary flex justify-between gap-3 items-center`,
          headerClassName
        )}
      >
        <h3 className="font-bold text-gray-800">{title}</h3>
        <div className="flex items-center gap-2" role="toolbar" aria-label="Window controls">
          <button type="button" aria-label="Minimize window">
            <Icon type="minify" className="h-4 p-0" />
          </button>
          <button type="button" aria-label="Maximize window">
            <Icon type="maximize" className="h-4 p-0" />
          </button>
        </div>
      </header>

      {hasBreadcrumbs ? (
        <Breadcrumb className="pl-[1.6875rem] pt-1">
          <BreadcrumbList className="text-xs text-gray-600 sm:gap-[0.2rem]">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;

              return (
                <>
                  <BreadcrumbItem key={`${crumb.path}-$crumb.label`}>
                    {isLast ? (
                      <BreadcrumbPage className="text-black">{crumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        href={crumb.path}
                        className="text-gray-600 hover:text-primary-500"
                        onClick={(event) => {
                          event.preventDefault();
                          handleBreadcrumbClick(crumb.path);
                        }}
                      >
                        {crumb.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast ? '–' : null}
                </>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      ) : null}
      <main className={cn(`p-[1.6875rem]`, bodyClassName)}>{children}</main>
    </article>
  );
}
