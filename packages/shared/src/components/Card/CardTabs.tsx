import { ScrollArea } from '@ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/tabs';
import * as React from 'react';
import { Activity } from 'react';
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

const CardTabs = React.forwardRef<HTMLDivElement, CardTabsProps>(
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
    const [activeValue, setActiveValue] = React.useState(
      defaultValue || (tabs.length > 0 ? tabs[0].value : '')
    );

    const contentWrapperClasses = cn(
      'bg-white',
      enableScrollX ? 'inline-block min-w-full' : 'block w-full',
      enableScrollY ? undefined : 'h-full'
    );

    const contentClasses = cn('h-full w-full min-h-0 min-w-0', tabsContentClassName);

    const hasScrollableAxis = enableScrollX || enableScrollY;

    const viewportClassName = cn(
      'h-full w-full min-h-0 min-w-0',
      enableScrollX ? 'overflow-x-auto' : 'overflow-x-hidden',
      enableScrollY ? 'overflow-y-auto' : 'overflow-y-hidden'
    );

    return (
      <Card ref={ref} {...cardProps} disableScrollArea>
        <Tabs
          value={activeValue}
          onValueChange={setActiveValue}
          className="w-full h-full min-h-0 flex flex-col"
        >
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
            >
              {tabs.map((tab) => (
                <TabsContent key={tab.value} value={tab.value} className={contentClasses}>
                  <Activity mode={activeValue === tab.value ? 'visible' : 'hidden'}>
                    <div className={contentWrapperClasses}>{tab.content}</div>
                  </Activity>
                </TabsContent>
              ))}
            </ScrollArea>
          ) : (
            <div className="flex-1 h-full min-h-0 min-w-0 overflow-hidden">
              {tabs.map((tab) => (
                <TabsContent key={tab.value} value={tab.value} className={contentClasses}>
                  <Activity mode={activeValue === tab.value ? 'visible' : 'hidden'}>
                    <div className={contentWrapperClasses}>{tab.content}</div>
                  </Activity>
                </TabsContent>
              ))}
            </div>
          )}
        </Tabs>
      </Card>
    );
  }
);

CardTabs.displayName = 'CardTabs';
export default CardTabs;
