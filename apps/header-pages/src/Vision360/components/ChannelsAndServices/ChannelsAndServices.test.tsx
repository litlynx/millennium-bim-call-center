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

    const first = screen.getByText('Internet Banking');
    const second = screen.getByText('Millennium IZI');
    const last = screen.getByText('Linha Millennium bim');

    const firstContainer = first.closest('div');
    const secondContainer = second.closest('div');
    const lastContainer = last.closest('div');

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
});
