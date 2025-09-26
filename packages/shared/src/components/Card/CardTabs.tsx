/** biome-ignore-all lint/correctness/useUniqueElementIds: is is being used statically */

import { ScrollArea, ScrollBar } from '@ui/scroll-area';
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
      enableScrollX = true,
      enableScrollY = true,
      ...cardProps
    },
    ref
  ) => {
    const defaultTab = defaultValue || (tabs.length > 0 ? tabs[0].value : '');

    const tabsContents = tabs.map((tab) => (
      <TabsContent
        key={tab.value}
        value={tab.value}
        className={cn(`bg-white`, tabsContentClassName)}
      >
        {tab.content}
      </TabsContent>
    ));

    const hasScrollableAxis = enableScrollX || enableScrollY;

    const scrollAreaClassName = cn(
      'h-full flex-1',
      !enableScrollX &&
        '[&_[data-radix-scroll-area-viewport]]:overflow-x-hidden [&_[data-orientation="horizontal"]]:hidden [&_[data-orientation="horizontal"]]:pointer-events-none',
      !enableScrollY &&
        '[&_[data-radix-scroll-area-viewport]]:overflow-y-hidden [&_[data-orientation="vertical"]]:hidden [&_[data-orientation="vertical"]]:pointer-events-none'
    );

    return (
      <Card ref={ref} {...cardProps} disableScrollArea>
        <Tabs defaultValue={defaultTab} className="w-full h-full flex flex-col">
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
            <ScrollArea className={scrollAreaClassName}>
              {tabsContents}
              {enableScrollY && (
                <ScrollBar
                  id="scroll-bar"
                  forceMount
                  className="w-2 p-0 rounded-full bg-gray-300/35 [&>div]:bg-primary-500 [&>div]:rounded-full mt-4 h-[calc(100%_-_1rem)]"
                />
              )}
              {enableScrollX && (
                <ScrollBar
                  orientation="horizontal"
                  forceMount
                  className="h-2 p-0 rounded-full bg-gray-300/35 [&>div]:bg-primary-500 [&>div]:rounded-full ml-4 w-[calc(100%_-_1rem)]"
                />
              )}
            </ScrollArea>
          ) : (
            <div className="flex-1 h-full overflow-hidden">{tabsContents}</div>
          )}
        </Tabs>
      </Card>
    );
  }
);

CardTabs.displayName = 'CardTabs';

export default CardTabs;
