import { beforeEach, describe, expect, type Mock, mock, test } from 'bun:test';
import { fireEvent, render, screen } from '@testing-library/react';
import type { CardTabItem, CardTabsProps } from 'shared/components';
import type {
  ClaimsProps,
  IncidentsProps
} from 'src/Vision360/components/ComplainsAndIncidents/types';

type NavFn = (path: string) => void;
const navigateSpy: Mock<NavFn> = mock<NavFn>();
mock.module('react-router', () => ({
  __esModule: true,
  useNavigate: () => navigateSpy
}));

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

  const Icon: React.FC<React.HTMLAttributes<HTMLSpanElement>> = (props) => (
    <span data-testid="icon" {...props} />
  );

  return { __esModule: true, CardTabs, Icon };
});

mock.module('./components/ClaimItem', () => ({
  __esModule: true,
  ClaimItem: ({ number }: ClaimsProps) => <div data-testid="claim-item">{number}</div>
}));

mock.module('./components/IncidentItem', () => ({
  __esModule: true,
  default: ({ id }: IncidentsProps) => <div data-testid="incident-item">{id}</div>
}));

async function loadComponent() {
  const mod = await import('./ComplainsAndIncidents');
  return (mod.default ?? mod) as React.FC<{ data?: unknown | null }>;
}

beforeEach(() => {
  navigateSpy.mockReset();
});

describe('ComplainsAndIncidents (bun:test)', () => {
  test('renders CardTabs with title and icon', async () => {
    const Component = await loadComponent();
    render(<Component />);

    expect(screen.getByText(/Reclamações \/ Incidentes/i)).toBeTruthy();
    expect(screen.getByTestId('icon')).toBeTruthy();
  });

  test('switches between tabs correctly', async () => {
    const Component = await loadComponent();
    render(<Component />);

    const claimsTab = screen.getByRole('tab', { name: 'Reclamações' });
    const incidentsTab = screen.getByRole('tab', { name: 'Incidentes' });

    expect(claimsTab.getAttribute('aria-selected')).toBe('true');
    expect(incidentsTab.getAttribute('aria-selected')).toBe('false');

    expect(screen.getAllByTestId('claim-item')).toHaveLength(2);

    fireEvent.click(incidentsTab);

    expect(claimsTab.getAttribute('aria-selected')).toBe('false');
    expect(incidentsTab.getAttribute('aria-selected')).toBe('true');

    fireEvent.click(claimsTab);

    expect(claimsTab.getAttribute('aria-selected')).toBe('true');
    expect(incidentsTab.getAttribute('aria-selected')).toBe('false');
  });

  test('renders correct default tab (claims)', async () => {
    const Component = await loadComponent();
    render(<Component />);

    const claimsTab = screen.getByRole('tab', { name: 'Reclamações' });

    console.log(claimsTab);

    expect(claimsTab.getAttribute('aria-selected')).toBe('true');
  });
});
