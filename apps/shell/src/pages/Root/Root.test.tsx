import { describe, expect, it, mock } from 'bun:test';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';

// Mock shared/components entry to a basic HTML button
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
mock.module('shared/components', () => ({
  Button: (props: ButtonProps) => <button {...props} />
}));

describe('Root page', () => {
  it('renders title text and the Vision360 navigation button', async () => {
    const Root = (await import('./Root')).default;
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Root />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Just a root page')).toBeTruthy();
    const navBtn = screen.getByRole('button', { name: /Go to Vision360/i });
    expect(navBtn).toBeTruthy();

    // Optional: ensure click does not throw (MemoryRouter provides navigate)
    fireEvent.click(navBtn);
  });
});
