/** biome-ignore-all lint/correctness/useUniqueElementIds: is is being used statically */

import { ScrollArea } from '@ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/tabs';
import * as React from 'react';
import { cn } from '@/lib/utils';
import type { CardProps } from './Card';
import Card from './Card';

export interface CardTabItem {
  value: string;
  label: React.ReactNode;
  content: React.ReactNode;
  dataTestId?: string;
}

export interface CardTabsProps extends Omit<CardProps, 'children'> {
  tabs: CardTabItem[];
  defaultValue?: string;
  tabsListClassName?: string;
  tabsTriggerClassName?: string;
  tabsContentClassName?: string;
  enableScrollX?: boolean;
  enableScrollY?: boolean;
}

const CardTabs: React.ForwardRefExoticComponent<
  CardTabsProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<HTMLDivElement, CardTabsProps>(
  (
    {
      tabs,
      defaultValue,
      tabsListClassName,
      tabsTriggerClassName,
      tabsContentClassName,
      enableScrollX = false,
      enableScrollY = true,
      ...cardProps
    },
    ref
  ) => {
    const defaultTab = defaultValue || (tabs.length > 0 ? tabs[0].value : '');

    const contentWrapperClasses = cn(
      'bg-white',
      enableScrollX ? 'inline-block min-w-full' : 'block w-full',
      enableScrollY ? undefined : 'h-full'
    );

    const contentClasses = cn('h-full w-full min-h-0 min-w-0', tabsContentClassName);

    const tabsContents = tabs.map((tab) => (
      <TabsContent key={tab.value} value={tab.value} className={contentClasses}>
        <div className={contentWrapperClasses}>{tab.content}</div>
      </TabsContent>
    ));

    const hasScrollableAxis = enableScrollX || enableScrollY;

    const viewportClassName = cn(
      'h-full w-full min-h-0 min-w-0',
      enableScrollX ? 'overflow-x-auto' : 'overflow-x-hidden',
      enableScrollY ? 'overflow-y-auto' : 'overflow-y-hidden'
    );

    return (
      <Card ref={ref} {...cardProps} disableScrollArea>
        <Tabs defaultValue={defaultTab} className="w-full h-full min-h-0 flex flex-col">
          <TabsList className={tabsListClassName}>
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={tabsTriggerClassName}
                data-testid={tab.dataTestId}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {hasScrollableAxis ? (
            <ScrollArea
              className="flex-1 h-full min-h-0 min-w-0"
              viewportClassName={viewportClassName}
              showScrollX={enableScrollX}
              showScrollY={enableScrollY}
              verticalScrollBarProps={{
                className:
                  'w-2 p-0 rounded-full bg-gray-300/35 [&>div]:bg-primary-500 [&>div]:rounded-full mt-4 h-[calc(100%_-_1rem)]'
              }}
              horizontalScrollBarProps={{
                className:
                  'h-2 p-0 rounded-full bg-gray-300/35 [&>div]:bg-primary-500 [&>div]:rounded-full'
              }}
            >
              {tabsContents}
            </ScrollArea>
          ) : (
            <div className="flex-1 h-full min-h-0 min-w-0 overflow-hidden">{tabsContents}</div>
          )}
        </Tabs>
      </Card>
    );
  }
);

CardTabs.displayName = 'CardTabs';

export default CardTabs;
