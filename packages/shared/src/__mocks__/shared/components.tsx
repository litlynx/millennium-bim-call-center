import type React from 'react';

// Define component types to match the real interfaces
export interface CardTabItem {
  value: string;
  label: string;
  content: React.ReactNode;
}

export interface CardTabsProps {
  icon?: React.ReactNode;
  title?: string;
  tabs: CardTabItem[];
  className?: string;
  defaultValue?: string;
}

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

// Mock implementations
export const CardTabs: React.FC<CardTabsProps> = ({
  icon,
  title,
  tabs,
  className,
  defaultValue
}) => {
  const React = require('react');
  const [activeTab, setActiveTab] = React.useState(defaultValue || tabs[0]?.value);

  const currentTab = tabs.find((tab: CardTabItem) => tab.value === activeTab);

  return (
    <div className={className} data-test-id="card-tab">
      <div>
        {icon}
        <h2>{title}</h2>
      </div>
      <div role="tablist">
        {tabs.map((tab: CardTabItem) => (
          <button
            key={tab.value}
            type="button"
            role="tab"
            onClick={() => setActiveTab(tab.value)}
            aria-selected={activeTab === tab.value}
            aria-controls={`tabpanel-${tab.value}`}
            data-testid={`tab-${tab.value}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`tabpanel-${activeTab}`} data-testid="tab-content">
        {currentTab?.content}
      </div>
    </div>
  );
};

export const Icon: React.FC<IconProps> = (props) => <span data-testid="icon" {...props} />;

export const Card: React.FC<{
  title?: React.ReactNode;
  onTitleClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}> = ({ title, onTitleClick, icon, className, children }) => (
  <div data-testid="card" className={className}>
    <div>
      {(icon || title) && (
        <h4>
          {icon}
          <button type="button" onClick={onTitleClick}>
            {title}
          </button>
        </h4>
      )}
    </div>
    <div>{children}</div>
  </div>
);

export const CardAccordion: React.FC<{
  items?: CardTabItem[];
  header?: React.ReactNode;
  children?: React.ReactNode;
}> = ({ items, header, children }) => (
  <div data-testid="card-accordion">
    {header && <div>{header}</div>}
    {items
      ? items.map((item) => (
          <div key={item.value}>
            <h3>{item.label}</h3>
            <div>{item.content}</div>
          </div>
        ))
      : children}
  </div>
);

export const CardItemLabel: React.FC<{ title: string; text: string }> = ({ title, text }) => (
  <div data-testid="card-item">
    <span>{title}</span>
    <p>{text}</p>
  </div>
);

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => (
  <button data-testid="button" {...props} />
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input data-testid="input" {...props} />
);
