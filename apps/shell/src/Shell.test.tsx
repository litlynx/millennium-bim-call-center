import { GlobalRegistrator } from '@happy-dom/global-registrator';

// Will load testing-library dynamically after DOM is ready
let render: typeof import('@testing-library/react').render;
let screen: typeof import('@testing-library/react').screen;

import { beforeAll, describe, expect, it } from 'bun:test';
import * as React from 'react';
import { MemoryRouter, Outlet, Route, Routes } from 'react-router';

// Ensure DOM globals exist for react-router (window, history)
GlobalRegistrator.register();
// Guarantee a body exists
if (typeof document !== 'undefined' && !document.body) {
  document.body = document.createElement('body');
  document.documentElement.appendChild(document.body);
}

// Establish a valid origin so BrowserRouter/history APIs work (defensive)
beforeAll(() => {
  if (typeof window !== 'undefined' && window.location.href === 'about:blank') {
    try {
      window.location.href = 'http://localhost/';
    } catch {
      // ignore
    }
  }
});

// Load testing library once DOM is available
beforeAll(async () => {
  const rtl = await import('@testing-library/react');
  render = rtl.render;
  screen = rtl.screen;
});

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
    render(<TestApp initialPath="/" />);
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
