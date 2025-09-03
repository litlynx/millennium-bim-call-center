import * as React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import Spinner from './components';
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
            <Route index element={<RootPage />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<DashboardLayout />} />
        </Routes>
      </BrowserRouter>
    </React.Suspense>
  );
};

export default App;
