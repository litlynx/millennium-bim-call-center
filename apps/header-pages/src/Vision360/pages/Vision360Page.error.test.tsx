import { describe, expect, it } from 'bun:test';
import { screen } from '@testing-library/react';
import { renderWithProviders } from 'src/__tests__/testUtils';

describe('Vision360Page (lazy loading)', () => {
  it('renders EstateAndProducts content via React.lazy (fallback may be instantaneous)', async () => {
    const Vision360Page = (await import('src/Vision360/pages/Vision360Page')).default;

    renderWithProviders(<Vision360Page />);

    // The lazy component can resolve synchronously in tests; just assert it renders
    expect(await screen.findByRole('button', { name: /Património e produtos/i })).toBeTruthy();
  });
});
