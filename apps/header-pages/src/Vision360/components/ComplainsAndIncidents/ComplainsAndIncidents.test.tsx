import { describe, expect, mock, test } from 'bun:test';
import { fireEvent, render, screen } from '@testing-library/react';
import type React from 'react';
import type {
  ClaimsProps,
  IncidentsProps
} from 'src/Vision360/components/ComplainsAndIncidents/types';

// Define mock for CardTabs to handle tab switching
interface CardTabItem {
  value: string;
  label: string;
  content: React.ReactNode;
}

interface CardTabsProps {
  icon?: React.ReactNode;
  title?: string;
  tabs: CardTabItem[];
  className?: string;
  defaultValue?: string;
}

// Mock all shared modules at the module level
mock.module('shared/components', () => {
  const React = require('react');

  const CardTabs = ({ icon, title, tabs, className, defaultValue }: CardTabsProps) => {
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

  return {
    CardTabs,
    Icon: (props: React.HTMLAttributes<HTMLSpanElement>) => <span data-testid="icon" {...props} />
  };
});

mock.module('react-router', () => ({
  useNavigate: () => mock(() => {})
}));

mock.module('./components/ClaimItem', () => ({
  __esModule: true,
  ClaimItem: ({ number }: ClaimsProps) => <div data-testid="claim-item">{number}</div>
}));

mock.module('./components/IncidentItem', () => ({
  __esModule: true,
  default: ({ id }: IncidentsProps) => <div data-testid="incident-item">{id}</div>
}));

// Import component after mocks are set up
const ComplainsAndIncidents = (await import('./ComplainsAndIncidents')).default;

describe('ComplainsAndIncidents', () => {
  test('renders CardTabs with title and icon', async () => {
    render(<ComplainsAndIncidents />);

    expect(screen.getByText(/Reclamações \/ Incidentes/i)).toBeTruthy();
    expect(screen.getByTestId('icon')).toBeTruthy();
  });

  test('switches between tabs correctly', async () => {
    render(<ComplainsAndIncidents />);

    const claimsTab = screen.getByRole('tab', { name: 'Reclamações' });
    const incidentsTab = screen.getByRole('tab', { name: 'Incidentes' });

    expect(claimsTab.getAttribute('aria-selected')).toBe('true');
    expect(incidentsTab.getAttribute('aria-selected')).toBe('false');

    // Check for claim items - using a more flexible approach since mocks may not always work in full suite
    const claimItems = screen.queryAllByTestId('claim-item');
    if (claimItems.length === 0) {
      // If mocked items aren't found, look for the actual claim content
      expect(screen.getAllByText(/Nº Reclamação/)).toHaveLength(2);
    } else {
      expect(claimItems).toHaveLength(2);
    }

    fireEvent.click(incidentsTab);

    expect(claimsTab.getAttribute('aria-selected')).toBe('false');
    expect(incidentsTab.getAttribute('aria-selected')).toBe('true');

    fireEvent.click(claimsTab);

    expect(claimsTab.getAttribute('aria-selected')).toBe('true');
    expect(incidentsTab.getAttribute('aria-selected')).toBe('false');
  });

  test('renders correct default tab (claims)', async () => {
    render(<ComplainsAndIncidents />);

    const claimsTab = screen.getByRole('tab', { name: 'Reclamações' });

    expect(claimsTab.getAttribute('aria-selected')).toBe('true');
  });
});
