import { describe, expect, it } from 'bun:test';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import DashboardLayout from './DashboardLayout';

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
