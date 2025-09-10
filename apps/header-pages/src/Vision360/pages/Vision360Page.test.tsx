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

  it('renders ComplainsAndIncidents component', async () => {
    render(<Vision360Page />);

    // Wait for the CardTabs component to render - use getAllByText for multiple matches
    const cardTabs = await screen.findAllByText(/Reclamações/i);
    expect(cardTabs.length).toBeGreaterThan(0);
  });

  it('renders all main layout sections with proper grid classes', () => {
    render(<Vision360Page />);

    // Verify the grid structure is present
    const gridContainer = document.querySelector('.grid-cols-24.grid-rows-10');
    expect(gridContainer).toBeTruthy();

    // Check that the main grid has expected styling classes
    expect(gridContainer?.className).toContain('gap-4');
    expect(gridContainer?.className).toContain('px-4');
    expect(gridContainer?.className).toContain('py-5');
    expect(gridContainer?.className).toContain('rounded-lg');
    expect(gridContainer?.className).toContain('bg-gray-100');
    expect(gridContainer?.className).toContain('w-full');
    expect(gridContainer?.className).toContain('h-screen');
    expect(gridContainer?.className).toContain('overflow-y-auto');
  });

  it('renders with proper accessibility structure', async () => {
    render(<Vision360Page />);

    // Check that Helmet is setting the title - need to wait for it
    await waitFor(() => {
      const title = document.querySelector('title');
      expect(title?.textContent).toBe('Visão 360');
    });

    // Verify main content area exists
    const mainContent = document.querySelector('.grid-cols-24');
    expect(mainContent).toBeTruthy();

    // Check grid layout structure
    const personalDataSection = document.querySelector('.row-span-10.col-span-5');
    expect(personalDataSection).toBeTruthy();

    const estateSection = document.querySelector('.col-start-6.col-span-12.row-span-5');
    expect(estateSection).toBeTruthy();

    const channelsSection = document.querySelector(
      '.col-start-6.col-span-12.row-span-5.row-start-6'
    );
    expect(channelsSection).toBeTruthy();

    const incidentsSection = document.querySelector(
      '.col-start-16.col-span-7.row-start-6.row-span-5'
    );
    expect(incidentsSection).toBeTruthy();
  });

  it('renders empty Last Contact section', () => {
    render(<Vision360Page />);

    // The Last Contact section is currently empty but should exist in the DOM
    const lastContactSection = document.querySelector(
      '.col-start-16.col-span-7.row-span-5:not(.row-start-6)'
    );
    expect(lastContactSection).toBeTruthy();

    // Verify it's empty (no child elements)
    expect(lastContactSection?.children.length).toBe(0);
  });

  it('should have LazyEstateAndProducts defined as a lazy component', () => {
    // This test ensures the lazy component is properly defined
    // Even though we can't easily test the error boundary in Bun test,
    // we can at least verify the component structure doesn't crash
    render(<Vision360Page />);

    // Verify that the estate section exists and doesn't crash
    const estateSection = document.querySelector('.col-start-6.col-span-12.row-span-5');
    expect(estateSection).toBeTruthy();

    // Verify the component renders something in that section
    expect(estateSection?.children.length).toBeGreaterThan(0);
  });

  it('renders all required grid sections with correct positioning', () => {
    render(<Vision360Page />);

    // Test specific grid positioning classes for all sections

    // Personal Data - left column, full height
    const personalData = document.querySelector('.row-span-10.col-span-5');
    expect(personalData).toBeTruthy();

    // Estate and Products - top center
    const estate = document.querySelector('.col-start-6.col-span-12.row-span-5:not(.row-start-6)');
    expect(estate).toBeTruthy();

    // Last Contact - top right (empty but positioned)
    const lastContact = document.querySelector(
      '.col-start-16.col-span-7.row-span-5:not(.row-start-6)'
    );
    expect(lastContact).toBeTruthy();

    // Channels and Services - bottom center
    const channels = document.querySelector('.col-start-6.col-span-12.row-span-5.row-start-6');
    expect(channels).toBeTruthy();

    // Incidents - bottom right
    const incidents = document.querySelector('.col-start-16.col-span-7.row-start-6.row-span-5');
    expect(incidents).toBeTruthy();

    // Verify main container classes
    const mainGrid = document.querySelector('.grid.grid-cols-24.grid-rows-10');
    expect(mainGrid?.className).toContain('gap-4');
    expect(mainGrid?.className).toContain('px-4');
    expect(mainGrid?.className).toContain('py-5');
    expect(mainGrid?.className).toContain('rounded-lg');
    expect(mainGrid?.className).toContain('bg-gray-100');
    expect(mainGrid?.className).toContain('w-full');
    expect(mainGrid?.className).toContain('h-screen');
    expect(mainGrid?.className).toContain('overflow-y-auto');
  });
});
