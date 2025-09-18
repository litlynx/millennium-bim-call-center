import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { act, fireEvent, render, screen } from '@testing-library/react';
import type * as React from 'react';
import { ComponentRegistry, registerComponent } from './ComponentRegistry';
import { LazyErrorBoundary } from './ErrorBoundary';

describe('Intelligent Component Recovery', () => {
  let shouldThrow = true;

  beforeEach(() => {
    // Reset state before each test
    shouldThrow = true;
    const registry = ComponentRegistry.getInstance();
    registry.clear();
  });

  // Component that throws an error initially but can be "fixed"
  const TestableComponent: React.FC = () => {
    if (shouldThrow) {
      throw new Error('Component failed to load');
    }
    return <div>Component loaded successfully</div>;
  };

  it('successfully recovers component using component registry', async () => {
    // Register the testable component
    registerComponent('TestableComponent', () => Promise.resolve({ default: TestableComponent }));

    // Initially, component should throw
    shouldThrow = true;

    render(
      <LazyErrorBoundary componentName="TestableComponent" enableIntelligentRecovery={true}>
        <TestableComponent />
      </LazyErrorBoundary>
    );

    // Verify error UI is shown
    expect(screen.getByText('Erro a carregar TestableComponent')).toBeInTheDocument();
    expect(screen.getByText('Recarregar Componente')).toBeInTheDocument();

    // "Fix" the component by setting shouldThrow to false
    shouldThrow = false;

    // Click the intelligent recovery button
    const recoveryButton = screen.getByText('Recarregar Componente');

    await act(async () => {
      fireEvent.click(recoveryButton);
      // Wait for recovery to complete
      await new Promise((resolve) => setTimeout(resolve, 150));
    });

    // Component should now load successfully
    expect(screen.getByText('Component loaded successfully')).toBeInTheDocument();
  });

  it('falls back to standard recovery for unregistered components', async () => {
    const onReset = mock(() => {});

    // Component that always throws for this test
    const AlwaysFailingComponent: React.FC = () => {
      throw new Error('Component failed to load');
    };

    render(
      <LazyErrorBoundary
        componentName="UnregisteredComponent"
        enableIntelligentRecovery={true}
        onReset={onReset}
      >
        <AlwaysFailingComponent />
      </LazyErrorBoundary>
    );

    // Click the intelligent recovery button
    const recoveryButton = screen.getByText('Recarregar Componente');

    await act(async () => {
      fireEvent.click(recoveryButton);
      // Small delay for the async operation
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    // Should call standard onReset callback
    expect(onReset).toHaveBeenCalled();
  });

  it('disables intelligent recovery when enableIntelligentRecovery is false', () => {
    // Component that always throws for this test
    const AlwaysFailingComponent: React.FC = () => {
      throw new Error('Component failed to load');
    };

    render(
      <LazyErrorBoundary componentName="TestableComponent" enableIntelligentRecovery={false}>
        <AlwaysFailingComponent />
      </LazyErrorBoundary>
    );

    // Intelligent recovery button should not be shown
    expect(screen.queryByText('Recarregar Componente')).not.toBeInTheDocument();

    // Standard recovery button should still be available
    expect(screen.getByText('Recarregar a página')).toBeInTheDocument();
  });
});
