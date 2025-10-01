/** biome-ignore-all lint/suspicious/noExplicitAny: needed for mocking data */
import '@config/bun-test-config/setup-tests';
import { describe, expect, it, mock } from 'bun:test';
import { render, screen } from '@testing-library/react';
import React from 'react';
import CardTabs, { type CardTabItem } from './CardTabs';

// Mock Card and UI dependencies
mock.module('./Card', () => ({
  default: React.forwardRef(({ children, ...props }: any, ref: any) => (
    <div data-testid="mock-card" ref={ref} {...props}>
      {children}
    </div>
  ))
}));
mock.module('@ui/scroll-area', () => {
  const ScrollBar = ({
    orientation = 'vertical',
    forceMount = true,
    className,
    'data-testid': dataTestId,
    ...props
  }: any) => (
    <div
      data-testid={dataTestId ?? `mock-scroll-bar-${orientation}`}
      data-orientation={orientation}
      data-forcemount={forceMount}
      className={className}
      {...props}
    />
  );

  const ScrollArea = ({
    children,
    className,
    viewportClassName,
    showScrollX = true,
    showScrollY = true,
    verticalScrollBarProps,
    horizontalScrollBarProps
  }: any) => {
    const verticalProps = {
      forceMount: true,
      'data-testid': 'mock-scroll-bar',
      ...(verticalScrollBarProps ?? {})
    };

    const horizontalProps = {
      forceMount: true,
      'data-testid': 'mock-scroll-bar-horizontal',
      ...(horizontalScrollBarProps ?? {})
    };

    return (
      <div data-testid="mock-scroll-area" className={className}>
        <div data-testid="mock-scroll-viewport" className={viewportClassName}>
          {children}
        </div>
        {showScrollY ? <ScrollBar orientation="vertical" {...verticalProps} /> : null}
        {showScrollX ? <ScrollBar orientation="horizontal" {...horizontalProps} /> : null}
      </div>
    );
  };

  return { ScrollArea, ScrollBar };
});
mock.module('@ui/tabs', () => ({
  Tabs: ({ children, defaultValue, ...props }: any) => (
    <div data-testid="mock-tabs" data-defaultvalue={defaultValue} {...props}>
      {children}
    </div>
  ),
  TabsList: ({ children, ...props }: any) => (
    <div data-testid="mock-tabs-list" {...props}>
      {children}
    </div>
  ),
  TabsTrigger: ({ children, 'data-testid': dataTestId, ...props }: any) => (
    <button data-testid="mock-tabs-trigger" {...props}>
      {children}
    </button>
  ),
  TabsContent: ({ children, ...props }: any) => (
    <div data-testid="mock-tabs-content" {...props}>
      {children}
    </div>
  )
}));

const tabs: CardTabItem[] = [
  { value: 'tab1', label: 'Tab 1', content: <div>Content 1</div> },
  { value: 'tab2', label: 'Tab 2', content: <div>Content 2</div> },
  { value: 'tab3', label: 'Tab 3', content: <div>Content 3</div> }
];

describe('CardTabs', () => {
  it('renders Card and Tabs structure', () => {
    render(<CardTabs tabs={tabs} />);
    expect(screen.getByTestId('mock-card')).toBeInTheDocument();
    expect(screen.getByTestId('mock-tabs')).toBeInTheDocument();
    expect(screen.getByTestId('mock-tabs-list')).toBeInTheDocument();
    expect(screen.getAllByTestId('mock-tabs-trigger')).toHaveLength(3);
    expect(screen.getAllByTestId('mock-tabs-content')).toHaveLength(3);
    expect(screen.getByTestId('mock-scroll-area')).toBeInTheDocument();
    expect(screen.getByTestId('mock-scroll-bar')).toBeInTheDocument();
  });

  it('renders tab labels and content', () => {
    render(<CardTabs tabs={tabs} />);
    tabs.forEach((tab) => {
      expect(screen.getByText(tab.label as string)).toBeInTheDocument();
      expect(screen.getByText(`Content ${tab.value.slice(-1)}`)).toBeInTheDocument();
    });
  });

  it('uses defaultValue if provided', () => {
    render(<CardTabs tabs={tabs} defaultValue="tab2" />);
    // The Tabs component is mocked, so we check the data attribute
    expect(screen.getByTestId('mock-tabs').getAttribute('data-defaultvalue')).toBe('tab2');
  });

  it('uses first tab as default if defaultValue is not provided', () => {
    render(<CardTabs tabs={tabs} />);
    expect(screen.getByTestId('mock-tabs').getAttribute('data-defaultvalue')).toBe('tab1');
  });

  it('applies custom class names to TabsList, TabsTrigger, TabsContent', () => {
    render(
      <CardTabs
        tabs={tabs}
        tabsListClassName="custom-list"
        tabsTriggerClassName="custom-trigger"
        tabsContentClassName="custom-content"
      />
    );
    expect(screen.getByTestId('mock-tabs-list').className).toContain('custom-list');
    screen.getAllByTestId('mock-tabs-trigger').forEach((trigger) => {
      expect(trigger.className).toContain('custom-trigger');
    });
    screen.getAllByTestId('mock-tabs-content').forEach((content) => {
      expect(content.className).toContain('custom-content');
    });
  });

  it('renders nothing if tabs array is empty', () => {
    render(<CardTabs tabs={[]} />);
    expect(screen.getByTestId('mock-card')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-tabs-list')).not.toBeNull();
    expect(screen.queryAllByTestId('mock-tabs-trigger')).toHaveLength(0);
    expect(screen.queryAllByTestId('mock-tabs-content')).toHaveLength(0);
  });

  it('forwards ref to Card', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardTabs tabs={tabs} ref={ref} />);
    expect(ref.current).not.toBeNull();
  });

  it('handles empty defaultValue with empty tabs array', () => {
    render(<CardTabs tabs={[]} defaultValue="" />);
    expect(screen.getByTestId('mock-tabs')).toBeInTheDocument();
    expect(screen.getByTestId('mock-tabs').getAttribute('data-defaultvalue')).toBe('');
  });

  it('handles empty defaultValue with non-empty tabs array', () => {
    render(<CardTabs tabs={tabs} defaultValue="" />);
    // When defaultValue is empty string, component falls back to first tab
    expect(screen.getByTestId('mock-tabs').getAttribute('data-defaultvalue')).toBe('tab1');
  });

  it('passes all cardProps to Card component', () => {
    const cardProps = {
      title: 'Test Title',
      description: 'Test Description',
      className: 'custom-card-class',
      'data-testid': 'custom-card'
    };

    render(<CardTabs tabs={tabs} {...cardProps} />);

    // Since Card is mocked, we verify that it receives the props using the custom testid
    const cardElement = screen.getByTestId('custom-card');
    expect(cardElement).toBeInTheDocument();
    expect(cardElement.className).toContain('custom-card-class');
    expect(cardElement.getAttribute('title')).toBe('Test Title');
    expect(cardElement.getAttribute('description')).toBe('Test Description');
  });

  it('renders ScrollBar with correct props', () => {
    render(<CardTabs tabs={tabs} />);

    const scrollBar = screen.getByTestId('mock-scroll-bar');
    expect(scrollBar).toBeInTheDocument();
    expect(scrollBar.getAttribute('data-orientation')).toBe('vertical');
    expect(scrollBar.getAttribute('data-forcemount')).toBe('true');
    // Check that the scrollBar contains expected classes
    const classNames = scrollBar.className;
    expect(classNames).toContain('w-2');
    expect(classNames).toContain('p-0');
    expect(classNames).toContain('rounded-full');
    expect(classNames).toContain('bg-gray-300/35');
    expect(classNames).toContain('[&>div]:bg-primary-500');
    expect(classNames).toContain('[&>div]:rounded-full');
    expect(classNames).toContain('mt-4');
    expect(classNames).toContain('h-[calc(100%_-_1rem)]');
  });

  it('applies cn utility to tabsContentClassName', () => {
    const customContentClass = 'my-custom-content-class';
    render(<CardTabs tabs={tabs} tabsContentClassName={customContentClass} />);

    screen.getAllByTestId('mock-tabs-content').forEach((content) => {
      expect(content.className).toContain(customContentClass);
    });
  });

  it('renders tabs with complex content structures', () => {
    const complexTabs: CardTabItem[] = [
      {
        value: 'complex1',
        label: (
          <span>
            Complex <strong>Label</strong> 1
          </span>
        ),
        content: (
          <div>
            <h3>Complex Content</h3>
            <p>With multiple elements</p>
            <button type="button">Action Button</button>
          </div>
        )
      },
      {
        value: 'complex2',
        label: 'Simple Label',
        content: <img src="test.jpg" alt="Test" />
      }
    ];

    render(<CardTabs tabs={complexTabs} />);

    // Check for the complex label parts
    expect(screen.getByText('Label')).toBeInTheDocument();
    expect(
      screen.getByText((_content, node) => {
        const hasText = (node: any) => node?.textContent === 'Complex Label 1';
        const nodeHasText = hasText(node);
        const childrenDontHaveText = Array.from(node?.children || []).every(
          (child) => !hasText(child)
        );
        return nodeHasText && childrenDontHaveText;
      })
    ).toBeInTheDocument();

    expect(screen.getByText('Simple Label')).toBeInTheDocument();
    expect(screen.getByText('Complex Content')).toBeInTheDocument();
    expect(screen.getByText('With multiple elements')).toBeInTheDocument();
    expect(screen.getByText('Action Button')).toBeInTheDocument();
    expect(screen.getByAltText('Test')).toBeInTheDocument();
  });

  it('handles single tab correctly', () => {
    const singleTab: CardTabItem[] = [
      { value: 'only', label: 'Only Tab', content: <div>Only Content</div> }
    ];

    render(<CardTabs tabs={singleTab} />);

    expect(screen.getAllByTestId('mock-tabs-trigger')).toHaveLength(1);
    expect(screen.getAllByTestId('mock-tabs-content')).toHaveLength(1);
    expect(screen.getByTestId('mock-tabs').getAttribute('data-defaultvalue')).toBe('only');
    expect(screen.getByText('Only Tab')).toBeInTheDocument();
    expect(screen.getByText('Only Content')).toBeInTheDocument();
  });

  it('ensures each tab has unique key and value attributes', () => {
    render(<CardTabs tabs={tabs} />);

    const triggers = screen.getAllByTestId('mock-tabs-trigger');
    const contents = screen.getAllByTestId('mock-tabs-content');

    triggers.forEach((trigger, index) => {
      expect(trigger).toHaveAttribute('value', tabs[index].value);
    });

    contents.forEach((content, index) => {
      expect(content).toHaveAttribute('value', tabs[index].value);
    });
  });

  it('renders all tabs components within the correct hierarchy', () => {
    render(<CardTabs tabs={tabs} />);

    const card = screen.getByTestId('mock-card');
    const tabsContainer = screen.getByTestId('mock-tabs');
    const tabsList = screen.getByTestId('mock-tabs-list');
    const scrollArea = screen.getByTestId('mock-scroll-area');

    expect(card).toContainElement(tabsContainer);
    expect(tabsContainer).toContainElement(tabsList);
    expect(tabsContainer).toContainElement(scrollArea);

    // Check that tabs have correct class
    const tabsClassNames = tabsContainer.className;
    expect(tabsClassNames).toContain('w-full');
    expect(tabsClassNames).toContain('h-full');
    expect(tabsClassNames).toContain('flex');
    expect(tabsClassNames).toContain('flex-col');

    // Check that scroll area has correct class
    expect(scrollArea.className).toContain('h-full');
  });
});
