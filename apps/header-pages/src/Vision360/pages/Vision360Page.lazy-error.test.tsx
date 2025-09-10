import { describe, expect, it, mock } from 'bun:test';
import { render, screen, waitFor } from '@testing-library/react';

// Mock the EstateAndProducts module to fail before importing Vision360Page
mock.module('../components/EstateAndProducts/EstateAndProducts', () => {
  return Promise.reject(new Error('Failed to load module'));
});

import Vision360Page from 'src/Vision360/pages/Vision360Page';

describe('Vision360Page - Lazy Loading Error Handling', () => {
  it('should handle EstateAndProducts lazy loading error gracefully', async () => {
    render(<Vision360Page />);

    // Wait for the error fallback to render
    // The error fallback should show when the lazy import fails
    await waitFor(
      async () => {
        const errorMessage = await screen.findByText(
          /Failed to load Estate and Products component/i
        );
        expect(errorMessage).toBeDefined();
        expect(errorMessage.className).toContain('text-red-500');
        expect(errorMessage.className).toContain('bg-white');
        expect(errorMessage.className).toContain('rounded-lg');
        expect(errorMessage.className).toContain('p-4');
        expect(errorMessage.className).toContain('text-center');
      },
      { timeout: 3000 }
    );
  });

  it('should still render other components when EstateAndProducts fails', async () => {
    render(<Vision360Page />);

    // Verify other sections still render properly
    const personalDataCard = await screen.findByRole('button', { name: /Dados Pessoais/i });
    expect(personalDataCard).toBeDefined();

    const channelsServicesCard = await screen.findByRole('button', { name: /Canais e serviços/i });
    expect(channelsServicesCard).toBeDefined();

    // Check that the main grid layout is still intact
    const gridContainer = document.querySelector('.grid-cols-24.grid-rows-10');
    expect(gridContainer).toBeTruthy();
  });
});
