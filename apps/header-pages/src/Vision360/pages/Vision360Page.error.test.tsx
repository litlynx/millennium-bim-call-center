import { describe, expect, it, mock } from 'bun:test';
import { render, screen } from '@testing-library/react';

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
describe('Vision360Page (lazy error fallback)', () => {
  it('renders fallback UI when lazy import of EstateAndProducts fails', async () => {
    // Make the dynamic import reject so the catch handler in Vision360Page.tsx runs
    mock.module('../components/EstateAndProducts/EstateAndProducts', () =>
      Promise.reject(new Error('Simulated dynamic import failure'))
    );

    try {
      const Vision360Page = (await import('src/Vision360/pages/Vision360Page')).default;

      render(<Vision360Page />);
      expect(await screen.findByText('Failed to load Estate and Products component')).toBeTruthy();
    } finally {
      mock.restore();
    }
  });
});
