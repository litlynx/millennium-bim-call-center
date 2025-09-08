import { beforeEach, describe, expect, type Mock, mock, test } from 'bun:test';
import { fireEvent, render, screen } from '@testing-library/react';

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

  const CardItemLabel: React.FC<{ title: string; text: string }> = ({ title, text }) => (
    <div data-testid="card-item">
      <span>{title}</span>
      <p>{text}</p>
    </div>
  );

  return { __esModule: true, Card, Icon, CardItemLabel };
});

async function loadComponent() {
  const mod = await import('./PersonalData');
  return (mod.default ?? mod) as React.FC<{ data?: unknown | null }>;
}

describe('PersonalData (bun:test)', () => {
  test('renders Card with title and icon', async () => {
    const Component = await loadComponent();
    render(<Component />);

    expect(screen.getByTestId('card')).toBeTruthy();
    expect(screen.getByText('Dados Pessoais')).toBeTruthy();
    expect(screen.getByTestId('icon')).toBeTruthy();
  });

  test('clicking the title navigates to the details route', async () => {
    const Component = await loadComponent();
    render(<Component />);

    const titleBtn = await screen.findByRole('button', { name: /dados pessoais/i });
    fireEvent.click(titleBtn);

    // Verify navigation was called once with the expected route
    const calls = (navigateSpy as unknown as { mock: { calls: string[][] } }).mock.calls;
    expect(calls.length).toBe(1);
    const [firstArg] = calls[0] ?? [];
    expect(firstArg).toBe('/personal-data?details=true');
  });

  test('renders items from mockData', async () => {
    const Component = await loadComponent();
    const data = {
      'Nome completo': 'Jacinto Fazenda Protótipo',
      CIF: '0000000'
    } as const;

    render(<Component data={data} />);

    const items = screen.getAllByTestId('card-item');
    expect(items.length).toBe(2);
  });
});
