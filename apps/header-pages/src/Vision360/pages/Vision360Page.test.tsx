import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import type * as React from 'react';

// Mock shared Button to a basic HTML button that forwards props
mock.module('shared/components', () => ({
  Button: (props: React.ComponentProps<'button'>) => <button {...props} />
}));

// Mock react-router's useNavigate to observe navigation calls
const mockNavigate = mock();
mock.module('react-router', () => ({
  useNavigate: () => mockNavigate
}));

const loadPage = async () => (await import('./Vision360Page')).default;

describe('Vision360Page', () => {
  afterEach(() => cleanup());
  beforeEach(() => {
    mockNavigate.mockReset();
    // Reset document title between tests
    document.title = '';
  });

  it('renders heading and action buttons', async () => {
    const Vision360Page = await loadPage();
    const { getByRole } = render(<Vision360Page />);
    expect(getByRole('heading', { name: /vision360 page/i })).toBeTruthy();
    expect(getByRole('button', { name: /go back to dashboard root/i })).toBeTruthy();
    expect(getByRole('button', { name: /go to sub-level route/i })).toBeTruthy();
  });

  it('sets the document title via Helmet', async () => {
    const Vision360Page = await loadPage();
    render(<Vision360Page />);
    await waitFor(() => expect(document.title).toBe('Call Center - Visao 360'));
  });

  it('navigates to "/" when clicking the back button', async () => {
    const Vision360Page = await loadPage();
    const { getByRole } = render(<Vision360Page />);
    fireEvent.click(getByRole('button', { name: /go back to dashboard root/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('navigates to "another-level" when clicking the sub-level button', async () => {
    const Vision360Page = await loadPage();
    const { getByRole } = render(<Vision360Page />);
    fireEvent.click(getByRole('button', { name: /go to sub-level route/i }));
    expect(mockNavigate).toHaveBeenCalledWith('another-level');
  });
});
