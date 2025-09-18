import { describe, expect, it } from 'bun:test';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { MemoryRouter, Outlet, Route, Routes } from 'react-router';

// Local stubs mirroring Shell routing tree
const DashboardLayoutStub: React.FC = () => (
  <div data-testid="layout">
    <Outlet />
  </div>
);
const RootPageStub: React.FC = () => <div data-testid="root">Root Page</div>;
const Vision360Stub: React.FC = () => <div data-testid="vision360">Vision360 App</div>;

const TestApp: React.FC<{ initialPath: string }> = ({ initialPath }) => (
  <React.Suspense fallback={<div data-testid="spinner" />}>
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/" element={<DashboardLayoutStub />}>
          <Route path="vision360/*" element={<Vision360Stub />} />
          <Route index element={<RootPageStub />} />
        </Route>
        <Route path="*" element={<DashboardLayoutStub />} />
      </Routes>
    </MemoryRouter>
  </React.Suspense>
);

describe('Shell routing (structure)', () => {
  it('renders DashboardLayout + Root page on "/"', async () => {
    await render(<TestApp initialPath="/" />);
    expect(await screen.findByTestId('layout')).toBeTruthy();
    expect(await screen.findByTestId('root')).toBeTruthy();
    expect(screen.queryByTestId('vision360')).toBeNull();
  });

  it('renders DashboardLayout + Vision360 app on "/vision360"', async () => {
    render(<TestApp initialPath="/vision360" />);
    expect(await screen.findByTestId('layout')).toBeTruthy();
    expect(await screen.findByTestId('vision360')).toBeTruthy();
    expect(screen.queryByTestId('root')).toBeNull();
  });

  it('renders DashboardLayout for unknown routes (catch-all)', async () => {
    render(<TestApp initialPath="/unknown/path" />);
    expect(await screen.findByTestId('layout')).toBeTruthy();
    expect(screen.queryByTestId('root')).toBeNull();
    expect(screen.queryByTestId('vision360')).toBeNull();
  });
});
