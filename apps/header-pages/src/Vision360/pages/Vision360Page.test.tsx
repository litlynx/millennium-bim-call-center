import { beforeEach, describe, expect, it } from 'bun:test';
import { render, screen, waitFor, within } from '@testing-library/react';
import Vision360Page from 'src/Vision360/pages/Vision360Page';

describe('Vision360Page', () => {
  beforeEach(async () => {
    // Reset title between tests
    document.title = '';

    // Clear navigation spy calls but don't reset the mock
    const { navigateSpy } = await import(
      '../../../../../packages/shared/src/__mocks__/react-router'
    );
    if (navigateSpy.mockClear) {
      navigateSpy.mockClear();
    }
  });

  it('renders the grid layout and ChannelsAndServices section', async () => {
    render(<Vision360Page />);
    const cards = await screen.findAllByTestId('card');
    expect(cards.length).toBeGreaterThanOrEqual(2); // PersonalData, ChannelsAndServices, and ComplainsAndIncidents
    const channelsAndServicesCard = cards.find((card) =>
      within(card).queryByRole('button', { name: /Canais e serviços/i })
    );
    // Ensure the card exists before proceeding to satisfy TypeScript without non-null assertion
    if (!channelsAndServicesCard) {
      throw new Error('Channels and Services card not found');
    }
    expect(within(channelsAndServicesCard).getByTestId('icon')).toBeDefined();
  });

  it('renders the grid layout and PersonalData card', async () => {
    render(<Vision360Page />);
    const cards = await screen.findAllByTestId('card');
    const personalDataCard = cards.find((card) =>
      within(card).queryByRole('button', { name: /Dados Pessoais/i })
    );
    expect(personalDataCard).toBeDefined();
  });
  it('renders the grid layout and Estate and Products card', async () => {
    render(<Vision360Page />);
    const cards = await screen.findAllByTestId('card');
    const estateAndProductsCard = cards.find((card) =>
      within(card).queryByRole('button', { name: /Património e produtos/i })
    );
    expect(estateAndProductsCard).toBeDefined();
  });

  it('sets the document title via Helmet', async () => {
    render(<Vision360Page />);
    // Vision360Page sets <title>Visão 360</title>
    await waitFor(() => expect(document.title).toBe('Visão 360'));
  });
});
