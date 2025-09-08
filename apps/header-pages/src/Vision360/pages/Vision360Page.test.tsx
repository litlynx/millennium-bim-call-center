import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, type Mock, mock } from 'bun:test';

// Provide minimal implementations for shared modules used by ChannelsAndServices
mock.module('shared/lib/utils', () => ({
  cn: (...inputs: unknown[]) => (inputs as unknown[]).flat().filter(Boolean).map(String).join(' ')
}));

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

// Mock react-router's useNavigate to avoid requiring a Router wrapper
type NavFn = (path: string) => void;
const navigateSpy: Mock<NavFn> = mock<NavFn>();
mock.module('react-router', () => ({
  __esModule: true,
  useNavigate: () => navigateSpy
}));

const loadPage = async () => (await import('./Vision360Page')).default;

describe('Vision360Page', () => {
  beforeEach(() => {
    // Reset title between tests
    document.title = '';
  });

  it('renders the grid layout and ChannelsAndServices section', async () => {
    const Vision360Page = await loadPage();
    render(<Vision360Page />);
    // Assert ChannelsAndServices content renders (title button and icon)
    expect(await screen.findByRole('button', { name: /Canais e serviços/i })).toBeTruthy();
    expect(screen.getByTestId('icon')).toBeTruthy();
  });

  it('sets the document title via Helmet', async () => {
    const Vision360Page = await loadPage();
    render(<Vision360Page />);
    // Vision360Page sets <title>Visão 360</title>
    await waitFor(() => expect(document.title).toBe('Visão 360'));
  });
});
