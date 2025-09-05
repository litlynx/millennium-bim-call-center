const Vision360Page = React.lazy(() => import('headerPages/App'));

import * as React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { client } from 'shared/queries';
import Spinner from './components';
import { LazyErrorBoundary } from './components/ErrorBoundary';
import { registerComponent } from './components/ErrorBoundary/ComponentRegistry';

// Register the HeaderPages component in the registry
const HeaderPages = React.lazy(() => import('headerPages/App'));
registerComponent('HeaderPages', () => import('headerPages/App'));

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
// Pages
import RootPage from './pages/Root/Root';

const App: React.FC = () => {
  return (
    <React.Suspense fallback={<Spinner />}>
      <BrowserRouter>
        <Routes>
          {/* Dashboard routes with DashboardLayout */}
          <Route path="/" element={<DashboardLayout />}>
            {/* Mount Vision360 micro-frontend with nested sub-routes */}
            <Route path="vision360/*" element={<Vision360Page />} />
            <Route index element={<RootPage />} />
          </Route>

            {/* Catch-all route */}
            <Route path="*" element={<DashboardLayout />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
  </React.Suspense>
  )
};

export default App;
