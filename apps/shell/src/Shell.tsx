import { QueryClientProvider } from '@tanstack/react-query';
import * as React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { client } from 'shared/queries';
import Spinner from './components';
import { LazyErrorBoundary } from './components/ErrorBoundary';
import { registerComponent } from './components/ErrorBoundary/ComponentRegistry';

// Register the components in the registry
const HeaderPages = React.lazy(() => import('headerPages/App'));
registerComponent('HeaderPages', () => import('headerPages/App'));
// Register the HeaderPages component in the registry
const SidebarPages = React.lazy(() => import('sidebarPages/App'));
registerComponent('SidebarPages', () => import('sidebarPages/App'));
// Register RecordsPages component in the registry
const RecordsPages = React.lazy(() => import('recordsPages/App'));
registerComponent('RecordsPages', () => import('recordsPages/App'));

const DocumentationPages = React.lazy(() => import('documentationPages/App'));
registerComponent('DocumentationPages', () => import('documentationPages/App'));

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

const App: React.FC = () => {
  return (
    <React.Suspense fallback={<Spinner />}>
      <QueryClientProvider client={client}>
        <BrowserRouter>
          <Routes>
            {/* Dashboard routes with DashboardLayout */}
            <Route path="/" element={<DashboardLayout />}>
              {/* make sidebar-pages the index at "/" */}
              <Route
                index
                element={
                  <LazyErrorBoundary componentName="SidebarPages" enableIntelligentRecovery>
                    <SidebarPages />
                  </LazyErrorBoundary>
                }
              />

              {/* HeaderPages handles the rest of the root namespace */}
              <Route
                path="/*"
                element={
                  <LazyErrorBoundary componentName="HeaderPages" enableIntelligentRecovery>
                    <HeaderPages />
                  </LazyErrorBoundary>
                }
              />

              {/* records mounted at /records - colocado antes do catch-all do HeaderPages */}
              <Route
                path="records/*"
                element={
                  <LazyErrorBoundary componentName="RecordsPages" enableIntelligentRecovery>
                    <RecordsPages />
                  </LazyErrorBoundary>
                }
              />

              <Route
                path="documentation/*"
                element={
                  <LazyErrorBoundary
                    componentName="DocumentationPages"
                    enableIntelligentRecovery={true}
                    onError={(error, errorInfo) => {
                      console.error('DocumentationPages component error:', error, errorInfo);
                      // You can add error reporting service here (e.g., Sentry)
                    }}
                    onReset={() => {
                      // Optional: Add any cleanup logic when user clicks "Try again"
                      console.log('Resetting DocumentationPages component');
                    }}
                  >
                    <React.Suspense fallback={<Spinner />}>
                      <DocumentationPages />
                    </React.Suspense>
                  </LazyErrorBoundary>
                }
              />
              {/* Default route */}
              <Route index element={<RootPage />} />

            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<DashboardLayout />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </React.Suspense>
  );
};

export default App;
