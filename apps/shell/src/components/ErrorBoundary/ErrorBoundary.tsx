import * as React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { getComponentRegistry } from './ComponentRegistry';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  componentName?: string;
  enableIntelligentRecovery?: boolean;
}

const ERROR_MESSAGES = {
  title: 'Erro a carregar',
  generic:
    'Houve um problema ao carregar este componente. Isto pode ser um problema temporário causado por problemas de rede, servidor ou do serviço.',
  technicalDetails: 'Detalhes Técnicos',
  intelligentRecovery: 'Recarregar Componente',
  standardRecovery: 'Tentar Novamente',
  pageReload: 'Recarregar a página',
  recovering: 'A recarregar...'
};

/**
 * Enhanced Fallback UI with intelligent recovery capabilities
 */
const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  componentName = 'component',
  enableIntelligentRecovery = true
}) => {
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
  const [isRecovering, setIsRecovering] = React.useState(false);

  /**
   * Attempt intelligent component recovery
   */
  const handleIntelligentRecovery = React.useCallback(async () => {
    if (!componentName || !enableIntelligentRecovery) {
      resetErrorBoundary();
      return;
    }

    setIsRecovering(true);

    try {
      const registry = getComponentRegistry();

      // Check if the component is registered
      if (registry.isRegistered(componentName)) {
        console.log(`Attempting to reload component: ${componentName}`);

        // Force reload the component
        const reloadedComponent = registry.reloadComponent(componentName);

        if (reloadedComponent) {
          console.log(`Successfully reloaded component: ${componentName}`);
          // Small delay to ensure the component is properly reloaded
          await new Promise((resolve) => setTimeout(resolve, 100));
          resetErrorBoundary();
        } else {
          console.warn(`Failed to reload component: ${componentName}`);
          resetErrorBoundary();
        }
      } else {
        console.warn(`Component not registered: ${componentName}`);
        resetErrorBoundary();
      }
    } catch (recoveryError) {
      console.error('Intelligent recovery failed:', recoveryError);
      resetErrorBoundary();
    } finally {
      setIsRecovering(false);
    }
  }, [componentName, enableIntelligentRecovery, resetErrorBoundary]);

  /**
   * Handle page reload
   */
  const handlePageReload = () => {
    window.location.reload();
  };

  return (
    <div className="p-5 m-5 rounded-xl bg-white border border-gray-100">
      <h4 className="text-primary mb-2.5 font-semibold">
        {ERROR_MESSAGES.title} {componentName}
      </h4>
      <p className="text-gray-600 mb-4">{ERROR_MESSAGES.generic}</p>

      <details
        className="whitespace-pre-wrap mb-4 text-left bg-gray-50 p-2.5 rounded-xl"
        open={isDetailsOpen}
        onToggle={(e) => setIsDetailsOpen((e.target as HTMLDetailsElement).open)}
      >
        <summary className="cursor-pointer font-bold mb-2.5 hover:text-gray-700">
          {ERROR_MESSAGES.technicalDetails}
        </summary>
        <div className="mt-2.5">
          <strong>Error:</strong> {error.message}
          {error.stack && (
            <>
              <br />
              <strong>Stack trace:</strong>
              <br />
              {error.stack}
            </>
          )}
        </div>
      </details>

      <div className="flex gap-2.5 justify-start">
        {/* Intelligent Recovery Button */}
        {enableIntelligentRecovery && componentName && (
          <button
            type="button"
            onClick={handleIntelligentRecovery}
            disabled={isRecovering}
            className="px-4 py-2 bg-primary-500 text-white border-none rounded-[1.75rem] cursor-pointer text-sm hover:bg-primary-700 disabled:bg-primary-400 disabled:cursor-not-allowed transition-colors"
          >
            {isRecovering ? ERROR_MESSAGES.recovering : ERROR_MESSAGES.intelligentRecovery}
          </button>
        )}

        {/* Page Reload Button */}
        <button
          type="button"
          onClick={handlePageReload}
          disabled={isRecovering}
          className="px-4 py-2 bg-gray-500 text-white border-none rounded-[1.75rem] cursor-pointer text-sm hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {ERROR_MESSAGES.pageReload}
        </button>
      </div>
    </div>
  );
};

interface LazyErrorBoundaryProps {
  children: React.ReactNode;
  componentName?: string;
  enableIntelligentRecovery?: boolean;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  onReset?: () => void;
}

/**
 * ErrorBoundary wrapper specifically designed for lazy-loaded components
 * Provides user-friendly error handling for dynamic imports with intelligent recovery
 */
export const LazyErrorBoundary: React.FC<LazyErrorBoundaryProps> = ({
  children,
  componentName,
  enableIntelligentRecovery = true,
  onError,
  onReset
}) => {
  return (
    <ReactErrorBoundary
      FallbackComponent={(props) => (
        <ErrorFallback
          {...props}
          componentName={componentName}
          enableIntelligentRecovery={enableIntelligentRecovery}
        />
      )}
      onError={(error, errorInfo) => {
        console.error(`Error in ${componentName || 'lazy component'}:`, error, errorInfo);

        // Call custom error handler if provided
        onError?.(error, errorInfo);

        // TODO: Add error reporting service integration here
        // Example: Sentry.captureException(error, { extra: errorInfo });
      }}
      onReset={() => {
        console.log(`Resetting ${componentName || 'lazy component'}`);
        onReset?.();
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
};

export default LazyErrorBoundary;
