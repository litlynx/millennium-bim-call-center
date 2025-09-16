import { afterAll, beforeAll, describe, expect, it, mock } from 'bun:test';
import { render, screen } from '@testing-library/react';
import { LazyErrorBoundary } from './ErrorBoundary';

// Mock component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('LazyErrorBoundary', () => {
  // Suppress console.error for these tests since we expect errors
  const originalError = console.error;
  beforeAll(() => {
    console.error = mock(() => {});
  });

  afterAll(() => {
    console.error = originalError;
  });

  it('renders children when there is no error', () => {
    render(
      <LazyErrorBoundary>
        <ThrowError shouldThrow={false} />
      </LazyErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('renders error fallback when child component throws', () => {
    render(
      <LazyErrorBoundary componentName="Test Component">
        <ThrowError shouldThrow={true} />
      </LazyErrorBoundary>
    );

    expect(screen.getByText('Erro a carregar Test Component')).toBeInTheDocument();
    expect(screen.getByText('Recarregar Componente')).toBeInTheDocument();
    expect(screen.getByText('Recarregar a página')).toBeInTheDocument();
  });

  it('shows error details when expanded', () => {
    render(
      <LazyErrorBoundary componentName="Test Component">
        <ThrowError shouldThrow={true} />
      </LazyErrorBoundary>
    );

    expect(screen.getByText('Detalhes Técnicos')).toBeInTheDocument();
    expect(screen.getByText(/Test error/)).toBeInTheDocument();
  });

  it('calls onError callback when error occurs', () => {
    const onError = mock(() => {});

    render(
      <LazyErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </LazyErrorBoundary>
    );

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String)
      })
    );
  });
});
