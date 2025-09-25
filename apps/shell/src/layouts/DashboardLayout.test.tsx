import { describe, expect, it, mock } from 'bun:test';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import DashboardLayout from './DashboardLayout';

// Mock the remote module federation imports
mock.module('headerPages/HeaderDiv', () => ({
  default: () => <div data-testid="header-div">Header</div>
}));

mock.module('sidebarPages/Sidebar', () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>
}));

describe('DashboardLayout', () => {
  it('renders children content via Outlet', async () => {
    const Child = () => <div data-testid="child">Hello</div>;

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Child />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByTestId('child')).toBeTruthy();
  });
});
