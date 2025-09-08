<<<<<<< HEAD
<<<<<<< HEAD
import { beforeEach, describe, expect, mock, test } from 'bun:test';
import { fireEvent, render, screen, within } from '@testing-library/react';
import type React from 'react';
import { MemoryRouter } from 'react-router';
import type { ChannelServiceState } from './components/State';

beforeEach(async () => {
  // Reset navigation spy between tests using the centralized mock
  const { navigateSpy } = await import(
    '../../../../../../packages/shared/src/__mocks__/react-router'
  );
  navigateSpy.mockClear();
});

// Import component after mocks are set up
const ChannelsAndServices = (
  await import('src/Vision360/components/ChannelsAndServices/ChannelsAndServices')
).default;

describe('ChannelsAndServices', () => {
  const renderWithRouter = (ui: React.ReactElement) => render(ui, { wrapper: MemoryRouter });

  test('applies spacing classes (pr-4/pl-4) when both sections are present', async () => {
    renderWithRouter(<ChannelsAndServices />);

    const digitalHeader = screen.getByText('Canais Digitais');
    const servicesHeader = screen.getByText('Serviços');

    // h4 -> parent div.flex -> parent div.space-y-2 [with optional pr-4/pl-4]
    const digitalContainer = digitalHeader.parentElement?.parentElement as HTMLDivElement | null;
    const servicesContainer = servicesHeader.parentElement?.parentElement as HTMLDivElement | null;

    expect(digitalContainer?.className.includes('pr-4')).toBe(true);
    expect(servicesContainer?.className.includes('pl-4')).toBe(true);
  });

  test('renders only services section without left padding when digital channels are absent', async () => {
    const data = {
      services: {
        id: 'services',
        title: 'Serviços',
        items: [
          { label: 'Pagamento', state: 'A' },
          { label: 'Transferência', state: 'B' }
        ] as { label: string; state: ChannelServiceState }[]
      }
    };

    renderWithRouter(<ChannelsAndServices data={data} />);

    // Only services header should be present
    const servicesHeader = screen.getByText('Serviços');
    expect(servicesHeader).toBeTruthy();
    expect(screen.queryByText('Canais Digitais')).toBeNull();

    const servicesContainer = servicesHeader.parentElement?.parentElement as HTMLDivElement | null;
    expect(servicesContainer?.className.includes('pl-4')).toBe(false);
  });

  test('renders only digital channels section without right padding when services are absent', async () => {
    const data = {
      digitalChannels: {
        id: 'digital',
        title: 'Canais Digitais',
        items: [
          { label: 'App Mobile', state: 'C' },
          { label: 'Internet Banking', state: 'A' }
        ] as { label: string; state: ChannelServiceState }[]
      }
    };

    renderWithRouter(<ChannelsAndServices data={data} />);

    // Only digital header should be present
    const digitalHeader = screen.getByText('Canais Digitais');
    expect(digitalHeader).toBeTruthy();
    expect(screen.queryByText('Serviços')).toBeNull();

    const digitalContainer = digitalHeader.parentElement?.parentElement as HTMLDivElement | null;
    expect(digitalContainer?.className.includes('pr-4')).toBe(false);
  });

  test('renders empty Card when data is null (no sections, no navigation on title click)', async () => {
    renderWithRouter(<ChannelsAndServices data={null} />);

    // Header still renders
    const titleBtn = await screen.findByRole('button', { name: /Canais e serviços/i });
    expect(titleBtn).toBeTruthy();
    expect(screen.getByTestId('icon')).toBeTruthy();

    // But no sections exist
    expect(screen.queryByText('Canais Digitais')).toBeNull();
    expect(screen.queryByText('Serviços')).toBeNull();

    // Clicking title should not navigate (no onTitleClick prop in this branch)
    fireEvent.click(titleBtn);
    const { navigateSpy } = await import(
      '../../../../../../packages/shared/src/__mocks__/react-router'
    );
    const calls = (navigateSpy as unknown as { mock: { calls: string[][] } }).mock.calls;
    expect(calls.length).toBe(0);
  });
  test('renders title, sections, items and state badges from mock data', async () => {
    renderWithRouter(<ChannelsAndServices />);

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
    // Create a fresh mock for this test to avoid interference
    const mockNavigate = mock((_path: string) => {});

    // Override the mock for this specific test
    mock.module('react-router', () => ({
      useNavigate: () => mockNavigate
    }));

    renderWithRouter(<ChannelsAndServices />);

    const titleBtn = await screen.findByRole('button', { name: /Canais e serviços/i });
    fireEvent.click(titleBtn);

    // Check the fresh mock
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/channels-and-services?details=true');
  });

  test('renders the icon in the Card header', async () => {
    renderWithRouter(<ChannelsAndServices />);
    expect(screen.getByTestId('icon')).toBeTruthy();
  });

  test('applies border classes to non-last items only', async () => {
    renderWithRouter(<ChannelsAndServices />);
=======
/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />

import { jest } from '@jest/globals';
import '@testing-library/jest-dom';

=======
import { beforeEach, describe, expect, type Mock, mock, test } from 'bun:test';
>>>>>>> aad75a4 ([sc-62] add sample tests (#15))
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
>>>>>>> 3dd8987 ([sc-32] vision 360 channels and services (#21))

    const first = screen.getByText('Internet Banking');
    const second = screen.getByText('Millennium IZI');
    const last = screen.getByText('Linha Millennium bim');

    const firstContainer = first.closest('div');
    const secondContainer = second.closest('div');
    const lastContainer = last.closest('div');

<<<<<<< HEAD
<<<<<<< HEAD
    expect(firstContainer?.className.includes('border-b')).toBe(true);
    expect(secondContainer?.className.includes('border-b')).toBe(true);
    expect(lastContainer?.className.includes('border-b')).toBe(false);
  });

  test('items with null state do not render a State badge', async () => {
    renderWithRouter(<ChannelsAndServices />);

    const item = screen.getByText('Extracto Mensal');
    const container = item.closest('div') as HTMLElement;
    const badge = within(container).queryByRole('img');
    expect(badge).toBeNull();
  });

  test('state badge includes accessible label text (aria-label)', async () => {
    renderWithRouter(<ChannelsAndServices />);
    const badges = screen.getAllByRole('img');
    const label = badges[0]?.getAttribute('aria-label') ?? '';
    expect(label).toMatch(/\((A|B|C|V|I)\)$/);
  });
=======
    expect(firstContainer).toHaveClass('border-b');
    expect(secondContainer).toHaveClass('border-b');
    expect(lastContainer).not.toHaveClass('border-b');
=======
    expect(firstContainer?.className.includes('border-b')).toBe(true);
    expect(secondContainer?.className.includes('border-b')).toBe(true);
    expect(lastContainer?.className.includes('border-b')).toBe(false);
>>>>>>> aad75a4 ([sc-62] add sample tests (#15))
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
<<<<<<< HEAD

  test('renders only digital channels when services section is missing', () => {
    jest.isolateModules(() => {
      jest.doMock('./mock-data/mock-data.json', () => ({
        __esModule: true,
        default: {
          digitalChannels: {
            id: 'digitalChannels',
            title: 'Canais Digitais',
            items: [{ label: 'Only Digital', state: 'A' }]
          }
        }
      }));
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const Component = require('./ChannelsAndServices').default as React.FC;

      render(<Component />);

      expect(screen.getByText('Canais Digitais')).toBeInTheDocument();
      expect(screen.queryByText('Serviços')).not.toBeInTheDocument();
      expect(screen.getByText('Only Digital')).toBeInTheDocument();
      expect(screen.getByRole('img')).toBeInTheDocument();
    });
  });

  test('renders an empty Card when data is missing (no grid or sections)', () => {
    jest.isolateModules(() => {
      jest.doMock('./mock-data/mock-data.json', () => ({
        __esModule: true,
        default: null
      }));
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const Component = require('./ChannelsAndServices').default as React.FC;

      render(<Component />);

      // Still shows the card header/title
      expect(screen.getByRole('button', { name: /Canais e serviços/i })).toBeInTheDocument();

      // But no sections are rendered
      expect(screen.queryByText('Canais Digitais')).not.toBeInTheDocument();
      expect(screen.queryByText('Serviços')).not.toBeInTheDocument();

      // And no badges
      expect(screen.queryAllByRole('img')).toHaveLength(0);
    });
  });
>>>>>>> 3dd8987 ([sc-32] vision 360 channels and services (#21))
=======
>>>>>>> aad75a4 ([sc-62] add sample tests (#15))
});
