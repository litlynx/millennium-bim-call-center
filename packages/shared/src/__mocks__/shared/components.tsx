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

export interface IconProps {
  type: string;
  rounded?: boolean;
  size?: 'sm' | 'lg';
  className?: string;
  onClick?: () => void;
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

export const Icon: React.FC<IconProps> = ({ type, size, className, onClick }) => (
  <span
    data-testid="icon"
    data-type={type}
    data-size={size}
    className={className}
    onClick={onClick}
  />
);

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

export const Badge: React.FC<{
  variant?: string;
  className?: string;
  children?: React.ReactNode;
}> = ({ variant, className, children }) => (
  <span data-testid="badge" data-variant={variant} className={className}>
    {children}
  </span>
);

export const TextArea: React.FC<{
  title?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  error?: string;
  maxLength?: number;
}> = ({ title, placeholder, value, onChange, onBlur, error, maxLength }) => (
  <div data-testid="textarea-container">
    {title && <div data-testid="textarea-title">{title}</div>}
    <textarea
      data-testid="textarea"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      maxLength={maxLength}
    />
    {error && <span data-testid="textarea-error">{error}</span>}
  </div>
);

export const PageHeader: React.FC<{
  type?: string;
  channelCategory?: string;
  serviceTitle?: string;
  user?: {
    customerName?: string;
    cif?: string;
    accountNumber?: string;
  };
}> = ({ channelCategory, serviceTitle }) => (
  <div data-testid="page-header">
    <h1>{serviceTitle}</h1>
    <div>{channelCategory}</div>
  </div>
);

export const ScriptDetail: React.FC<{
  title?: string;
}> = ({ title }) => (
  <div data-testid="script-detail">
    <h2>{title}</h2>
  </div>
);

export const Table: React.FC<{
  headers?: Array<{ key: string; label: string; boldColumn?: boolean }>;
  data?: Array<{ cells: Array<{ content: React.ReactNode }> }>;
}> = ({ headers = [], data = [] }) => (
  <div data-testid="table">
    <table>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header.key} data-testid={`header-${header.key}`}>
              {header.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: Mock component for testing
          <tr key={rowIndex} data-testid={`row-${rowIndex}`}>
            {row.cells.map((cell, cellIndex) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: Mock component for testing
              <td key={cellIndex} data-testid={`cell-${rowIndex}-${cellIndex}`}>
                {cell.content}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const useTextArea = ({
  required,
  maxLength,
  initialValue
}: {
  required?: boolean;
  maxLength?: number;
  initialValue?: string;
}) => {
  const React = require('react');
  const [value, setValue] = React.useState(initialValue || '');
  const [error, setError] = React.useState('');

  const validate = () => {
    if (required && !value.trim()) {
      setError('Este campo é obrigatório');
      return false;
    }
    if (maxLength && value.length > maxLength) {
      setError(`Máximo ${maxLength} caracteres`);
      return false;
    }
    setError('');
    return true;
  };

  return {
    value,
    error,
    validate,
    textAreaProps: {
      value,
      onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value),
      onBlur: validate,
      error
    }
  };
};

export default {
  CardTabs,
  Icon,
  Card,
  CardAccordion,
  CardItemLabel,
  Button,
  Input,
  Badge,
  TextArea,
  PageHeader,
  ScriptDetail,
  Table,
  useTextArea
};
