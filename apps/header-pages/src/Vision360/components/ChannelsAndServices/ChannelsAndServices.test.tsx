import { beforeEach, describe, expect, type Mock, mock, test } from 'bun:test';
import { fireEvent, render, screen, within } from '@testing-library/react';
import type React from 'react';

// Note on mocking order:
// - We use dynamic import() of the component inside each test to ensure
//   these mocks apply before the module is evaluated.

// Minimal replacement for shared/lib/utils.cn used by <State />
mock.module('shared/lib/utils', () => ({
  cn: (...inputs: unknown[]) => inputs.flat().filter(Boolean).map(String).join(' ')
}));

// Minimal Card and Icon to avoid cross-package federation during tests
mock.module('shared/components', () => {
  const React = require('react');
  const Card: React.FC<{
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
            {/* Render title as a button so tests can click */}
            <button type="button" onClick={onTitleClick}>
              {title}
            </button>
          </h4>
        )}
      </div>
      <div>{children}</div>
    </div>
  );

  const Icon: React.FC<React.HTMLAttributes<HTMLSpanElement>> = (props) => (
    <span data-testid="icon" {...props} />
  );

  return { __esModule: true, Card, Icon };
});

// Spy for navigation calls
type NavFn = (path: string) => void;
const navigateSpy: Mock<NavFn> = mock<NavFn>();
mock.module('react-router', () => ({
  __esModule: true,
  useNavigate: () => navigateSpy
}));

beforeEach(() => {
  // reset call history between tests
  navigateSpy.mockReset();
  // Also clear Testing Library screen between tests is handled by global setup
});

async function loadComponent() {
  const mod = await import('./ChannelsAndServices');
  return (mod.default ?? mod) as React.FC<{ data?: unknown | null }>;
}

describe('ChannelsAndServices (bun:test)', () => {
  test('applies spacing classes (pr-4/pl-4) when both sections are present', async () => {
    const Component = await loadComponent();
    render(<Component />);

    const digitalHeader = screen.getByText('Canais Digitais');
    const servicesHeader = screen.getByText('Serviços');

    // h4 -> parent div.flex -> parent div.space-y-2 [with optional pr-4/pl-4]
    const digitalContainer = digitalHeader.parentElement?.parentElement as HTMLDivElement | null;
    const servicesContainer = servicesHeader.parentElement?.parentElement as HTMLDivElement | null;

    expect(digitalContainer?.className.includes('pr-4')).toBe(true);
    expect(servicesContainer?.className.includes('pl-4')).toBe(true);
  });

  test('renders only services section without left padding when digital channels are absent', async () => {
    const Component = await loadComponent();
    const data = {
      services: {
        id: 'services',
        title: 'Serviços',
        items: [
          { label: 'Pagamento', state: 'A' },
          { label: 'Transferência', state: 'B' }
        ]
      }
    } as const;

    render(<Component data={data} />);

    // Only services header should be present
    const servicesHeader = screen.getByText('Serviços');
    expect(servicesHeader).toBeTruthy();
    expect(screen.queryByText('Canais Digitais')).toBeNull();

    const servicesContainer = servicesHeader.parentElement?.parentElement as HTMLDivElement | null;
    expect(servicesContainer?.className.includes('pl-4')).toBe(false);
  });

  test('renders only digital channels section without right padding when services are absent', async () => {
    const Component = await loadComponent();
    const data = {
      digitalChannels: {
        id: 'digital',
        title: 'Canais Digitais',
        items: [
          { label: 'App Mobile', state: 'C' },
          { label: 'Internet Banking', state: 'A' }
        ]
      }
    } as const;

    render(<Component data={data} />);

    // Only digital header should be present
    const digitalHeader = screen.getByText('Canais Digitais');
    expect(digitalHeader).toBeTruthy();
    expect(screen.queryByText('Serviços')).toBeNull();

    const digitalContainer = digitalHeader.parentElement?.parentElement as HTMLDivElement | null;
    expect(digitalContainer?.className.includes('pr-4')).toBe(false);
  });

  test('renders empty Card when data is null (no sections, no navigation on title click)', async () => {
    const Component = await loadComponent();
    render(<Component data={null} />);

    // Header still renders
    const titleBtn = await screen.findByRole('button', { name: /Canais e serviços/i });
    expect(titleBtn).toBeTruthy();
    expect(screen.getByTestId('icon')).toBeTruthy();

    // But no sections exist
    expect(screen.queryByText('Canais Digitais')).toBeNull();
    expect(screen.queryByText('Serviços')).toBeNull();

    // Clicking title should not navigate (no onTitleClick prop in this branch)
    fireEvent.click(titleBtn);
    const calls = (navigateSpy as unknown as { mock: { calls: string[][] } }).mock.calls;
    expect(calls.length).toBe(0);
  });
  test('renders title, sections, items and state badges from mock data', async () => {
    const Component = await loadComponent();
    render(<Component />);

    // Title button via Card mock
    const titleBtn = await screen.findByRole('button', { name: /Canais e serviços/i });
    expect(titleBtn).toBeTruthy();

    // Section headers
    expect(screen.getByText('Canais Digitais')).toBeTruthy();
    expect(screen.getByText('Serviços')).toBeTruthy();

    // Some known items from mock-data
    expect(screen.getByText('Internet Banking')).toBeTruthy();
    expect(screen.getByText('Millennium IZI')).toBeTruthy();
    expect(screen.getByText('Linha Millennium bim')).toBeTruthy();
    expect(screen.getByText('Cartão de Débito Estudante')).toBeTruthy();
    expect(screen.getByText('Extracto Mensal')).toBeTruthy();
    expect(screen.getByText('Seguro de Vida')).toBeTruthy();

    // State badges: role="img"
    const badges = screen.getAllByRole('img');
    expect(Array.isArray(badges)).toBe(true);
    // 3 items in mock data have states
    expect(badges.length).toBe(3);
    // Ensure a badge contains one of the letters A/B/C
    expect(/^[ACB]$/.test((badges[0]?.textContent ?? '').trim())).toBe(true);
  });

  test('clicking the title navigates to the details route', async () => {
    const Component = await loadComponent();
    render(<Component />);

    const titleBtn = await screen.findByRole('button', { name: /Canais e serviços/i });
    fireEvent.click(titleBtn);

    // Verify navigation was called once with the expected route
    const calls = (navigateSpy as unknown as { mock: { calls: string[][] } }).mock.calls;
    expect(calls.length).toBe(1);
    const [firstArg] = calls[0] ?? [];
    expect(firstArg).toBe('/channels-and-services?details=true');
  });

  test('renders the icon in the Card header', async () => {
    const Component = await loadComponent();
    render(<Component />);
    expect(screen.getByTestId('icon')).toBeTruthy();
  });

  test('applies border classes to non-last items only', async () => {
    const Component = await loadComponent();
    render(<Component />);

    const first = screen.getByText('Internet Banking');
    const second = screen.getByText('Millennium IZI');
    const last = screen.getByText('Linha Millennium bim');

    const firstContainer = first.closest('div');
    const secondContainer = second.closest('div');
    const lastContainer = last.closest('div');

    expect(firstContainer?.className.includes('border-b')).toBe(true);
    expect(secondContainer?.className.includes('border-b')).toBe(true);
    expect(lastContainer?.className.includes('border-b')).toBe(false);
  });

  test('items with null state do not render a State badge', async () => {
    const Component = await loadComponent();
    render(<Component />);

    const item = screen.getByText('Extracto Mensal');
    const container = item.closest('div') as HTMLElement;
    const badge = within(container).queryByRole('img');
    expect(badge).toBeNull();
  });

  test('state badge includes accessible label text (aria-label)', async () => {
    const Component = await loadComponent();
    render(<Component />);
    const badges = screen.getAllByRole('img');
    const label = badges[0]?.getAttribute('aria-label') ?? '';
    expect(label).toMatch(/\((A|B|C|V|I)\)$/);
  });
});
