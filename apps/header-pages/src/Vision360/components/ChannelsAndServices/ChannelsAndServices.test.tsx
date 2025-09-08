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

import { fireEvent, render, screen, within } from '@testing-library/react';
import type React from 'react';

// Mock shared/components to avoid cross-package alias issues and keep tests focused.
jest.mock('shared/components', () => {
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
        {/* Mimic Card header with title inside a clickable button when handler exists */}
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

  const Icon: React.FC<React.HTMLAttributes<HTMLSpanElement>> = (props) => (
    <span data-testid="icon" {...props} />
  );

  return { __esModule: true, Card, Icon };
});

// Mock react-router's useNavigate to capture navigations
const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  __esModule: true,
  useNavigate: jest.fn()
}));

describe('ChannelsAndServices', () => {
  beforeEach(() => {
    jest.resetModules();
    mockNavigate.mockReset();
    // Set the navigate mock for each test
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { useNavigate } = require('react-router');
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  test('renders title, sections, items and state badges from mock data', async () => {
    // Load with actual bundled mock-data
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Component = require('./ChannelsAndServices').default as React.FC;

    render(<Component />);

    // Title is rendered via Card
    expect(screen.getByRole('button', { name: /Canais e serviços/i })).toBeInTheDocument();

    // Section headers
    expect(screen.getByText('Canais Digitais')).toBeInTheDocument();
    expect(screen.getByText('Serviços')).toBeInTheDocument();

    // Items
    expect(screen.getByText('Internet Banking')).toBeInTheDocument();
    expect(screen.getByText('Millennium IZI')).toBeInTheDocument();
    expect(screen.getByText('Linha Millennium bim')).toBeInTheDocument();
    expect(screen.getByText('Cartão de Débito Estudante')).toBeInTheDocument();
    expect(screen.getByText('Extracto Mensal')).toBeInTheDocument();
    expect(screen.getByText('Seguro de Vida')).toBeInTheDocument();

    // State badges: 3 items have state in the mock data (C, A, B)
    // State component renders role="img"
    const badges = screen.getAllByRole('img');
    expect(badges).toHaveLength(3);
    // Ensure they include their letters inside
    expect(within(badges[0]).getByText(/^[ACB]$/)).toBeInTheDocument();
  });

  test('clicking the title navigates to the details route', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Component = require('./ChannelsAndServices').default as React.FC;

    render(<Component />);
    fireEvent.click(screen.getByRole('button', { name: /Canais e serviços/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/channels-and-services?details=true');
  });

  test('renders the icon in the Card header', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Component = require('./ChannelsAndServices').default as React.FC;

    render(<Component />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  test('applies border classes to non-last items only', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Component = require('./ChannelsAndServices').default as React.FC;

    render(<Component />);
>>>>>>> 3dd8987 ([sc-32] vision 360 channels and services (#21))

    const first = screen.getByText('Internet Banking');
    const second = screen.getByText('Millennium IZI');
    const last = screen.getByText('Linha Millennium bim');

    const firstContainer = first.closest('div');
    const secondContainer = second.closest('div');
    const lastContainer = last.closest('div');

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
  });

  test('items with null state do not render a State badge', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Component = require('./ChannelsAndServices').default as React.FC;

    render(<Component />);

    const item = screen.getByText('Extracto Mensal');
    // container div of this specific item should not contain any role="img"
    const container = item.closest('div') as HTMLElement;
    expect(within(container).queryByRole('img')).not.toBeInTheDocument();
  });

  test('renders only one section when the other is missing', () => {
    jest.isolateModules(() => {
      // Provide data with only services
      jest.doMock('./mock-data/mock-data.json', () => ({
        __esModule: true,
        default: {
          services: {
            id: 'services',
            title: 'Serviços',
            items: [{ label: 'Only Service', state: 'B' }]
          }
        }
      }));
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const Component = require('./ChannelsAndServices').default as React.FC;

      render(<Component />);

      // Only Serviços present
      expect(screen.queryByText('Canais Digitais')).not.toBeInTheDocument();
      expect(screen.getByText('Serviços')).toBeInTheDocument();
      expect(screen.getByText('Only Service')).toBeInTheDocument();
      // Badge exists for 'B'
      expect(screen.getByRole('img')).toBeInTheDocument();
    });
  });

  test('state badge includes accessible label text (aria-label)', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Component = require('./ChannelsAndServices').default as React.FC;

    render(<Component />);
    const badges = screen.getAllByRole('img');
    // At least one badge should have a readable aria-label
    expect(badges[0]).toHaveAttribute('aria-label');
    // one of the known labels from State.tsx
    const label = badges[0].getAttribute('aria-label') ?? '';
    expect(label).toMatch(/\((A|B|C|V|I)\)$/);
  });

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
});
