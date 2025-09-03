/** biome-ignore-all lint/correctness/useUniqueElementIds: is is being used statically */
import { ScrollArea, ScrollBar } from '@ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/tabs';
import React from 'react';
import { cn } from '@/lib/utils';
import type { CardProps } from './Card';
import Card from './Card';

export interface CardTabItem {
  value: string;
  label: React.ReactNode;
  content: React.ReactNode;
}

export interface CardTabsProps extends Omit<CardProps, 'children'> {
  tabs: CardTabItem[];
  defaultValue?: string;
  tabsListClassName?: string;
  tabsTriggerClassName?: string;
  tabsContentClassName?: string;
}

const CardTabs = React.forwardRef<HTMLDivElement, CardTabsProps>(
  (
    {
      tabs,
      defaultValue,
      tabsListClassName,
      tabsTriggerClassName,
      tabsContentClassName,
      ...cardProps
    },
    ref
  ) => {
    const defaultTab = defaultValue || (tabs.length > 0 ? tabs[0].value : '');

    return (
      <Card ref={ref} {...cardProps}>
        <Tabs defaultValue={defaultTab} className="w-full h-full flex flex-col">
          <TabsList className={tabsListClassName}>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className={tabsTriggerClassName}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <ScrollArea className="h-full">
            {tabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className={cn(tabsContentClassName)}>
                {tab.content}
              </TabsContent>
            ))}
            <ScrollBar
              id="scroll-bar"
              forceMount
              className="w-2 p-0 rounded-full bg-gray-300/35 [&>div]:bg-primary-500 [&>div]:rounded-full mt-4 h-[calc(100%_-_1rem)]"
            />
          </ScrollArea>
        </Tabs>
      </Card>
    );
  }
);

CardTabs.displayName = 'CardTabs';

export default CardTabs;
