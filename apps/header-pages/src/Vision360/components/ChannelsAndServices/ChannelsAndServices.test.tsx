import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, mock, test } from 'bun:test';
import type React from 'react';
import { MemoryRouter } from 'react-router';
import type { ChannelServiceState } from './components/State';

beforeEach(async () => {
  // Reset navigation spy between tests using the centralized mock
  const { navigateSpy } = await import(
    '../../../../../../packages/shared/src/__mocks__/react-router'
  );
  navigateSpy.mockClear();
});

// Import component after mocks are set up
const ChannelsAndServices = (
  await import('src/Vision360/components/ChannelsAndServices/ChannelsAndServices')
).default;

describe('ChannelsAndServices', () => {
  const renderWithRouter = (ui: React.ReactElement) => render(ui, { wrapper: MemoryRouter });

  test('applies spacing classes (pr-4/pl-4) when both sections are present', async () => {
    renderWithRouter(<ChannelsAndServices />);

    const digitalHeader = screen.getByText('Canais Digitais');
    const servicesHeader = screen.getByText('Serviços');

    // h4 -> parent div.flex -> parent div.space-y-2 [with optional pr-4/pl-4]
    const digitalContainer = digitalHeader.parentElement?.parentElement as HTMLDivElement | null;
    const servicesContainer = servicesHeader.parentElement?.parentElement as HTMLDivElement | null;

    expect(digitalContainer?.className.includes('pr-4')).toBe(true);
    expect(servicesContainer?.className.includes('pl-4')).toBe(true);
  });

  test('renders only services section without left padding when digital channels are absent', async () => {
    const data = {
      services: {
        id: 'services',
        title: 'Serviços',
        items: [
          { label: 'Pagamento', state: 'A' },
          { label: 'Transferência', state: 'B' }
        ] as { label: string; state: ChannelServiceState }[]
      }
    };

    renderWithRouter(<ChannelsAndServices data={data} />);

    // Only services header should be present
    const servicesHeader = screen.getByText('Serviços');
    expect(servicesHeader).toBeTruthy();
    expect(screen.queryByText('Canais Digitais')).toBeNull();

    const servicesContainer = servicesHeader.parentElement?.parentElement as HTMLDivElement | null;
    expect(servicesContainer?.className.includes('pl-4')).toBe(false);
  });

  test('renders only digital channels section without right padding when services are absent', async () => {
    const data = {
      digitalChannels: {
        id: 'digital',
        title: 'Canais Digitais',
        items: [
          { label: 'App Mobile', state: 'C' },
          { label: 'Internet Banking', state: 'A' }
        ] as { label: string; state: ChannelServiceState }[]
      }
    };

    renderWithRouter(<ChannelsAndServices data={data} />);

    // Only digital header should be present
    const digitalHeader = screen.getByText('Canais Digitais');
    expect(digitalHeader).toBeTruthy();
    expect(screen.queryByText('Serviços')).toBeNull();

    const digitalContainer = digitalHeader.parentElement?.parentElement as HTMLDivElement | null;
    expect(digitalContainer?.className.includes('pr-4')).toBe(false);
  });

  test('renders empty Card when data is null (no sections, no navigation on title click)', async () => {
    renderWithRouter(<ChannelsAndServices data={null} />);

    // Header still renders
    const titleBtn = await screen.findByRole('button', { name: /Canais e serviços/i });
    expect(titleBtn).toBeTruthy();
    expect(screen.getByTestId('icon')).toBeTruthy();

    // But no sections exist
    expect(screen.queryByText('Canais Digitais')).toBeNull();
    expect(screen.queryByText('Serviços')).toBeNull();

    // Clicking title should not navigate (no onTitleClick prop in this branch)
    fireEvent.click(titleBtn);
    const { navigateSpy } = await import(
      '../../../../../../packages/shared/src/__mocks__/react-router'
    );
    const calls = (navigateSpy as unknown as { mock: { calls: string[][] } }).mock.calls;
    expect(calls.length).toBe(0);
  });
  test('renders title, sections, items and state badges from mock data', async () => {
    renderWithRouter(<ChannelsAndServices />);

    // Title button via Card mock
    const titleBtn = await screen.findByRole('button', { name: /Canais e serviços/i });
    expect(titleBtn).toBeTruthy();

    // Section headers
    expect(screen.getByText('Canais Digitais')).toBeTruthy();
    expect(screen.getByText('Serviços')).toBeTruthy();

    // Some known items from mock-data
    expect(screen.getByText('Internet Banking')).toBeTruthy();
    expect(screen.getByText('Millennium IZI')).toBeTruthy();
    expect(screen.getByText('Linha Millennium bim')).toBeTruthy();
    expect(screen.getByText('Cartão de Débito Estudante')).toBeTruthy();
    expect(screen.getByText('Extracto Mensal')).toBeTruthy();
    expect(screen.getByText('Seguro de Vida')).toBeTruthy();

    // State badges: role="img"
    const badges = screen.getAllByRole('img');
    expect(Array.isArray(badges)).toBe(true);
    // 3 items in mock data have states
    expect(badges.length).toBe(3);
    // Ensure a badge contains one of the letters A/B/C
    expect(/^[ACB]$/.test((badges[0]?.textContent ?? '').trim())).toBe(true);
  });

  test('clicking the title navigates to the details route', async () => {
    // Create a fresh mock for this test to avoid interference
    const mockNavigate = mock((_path: string) => {});

    // Override the mock for this specific test
    mock.module('react-router', () => ({
      useNavigate: () => mockNavigate
    }));

    renderWithRouter(<ChannelsAndServices />);

    const titleBtn = await screen.findByRole('button', { name: /Canais e serviços/i });
    fireEvent.click(titleBtn);

    // Check the fresh mock
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/channels-and-services?details=true');
  });

  test('renders the icon in the Card header', async () => {
    renderWithRouter(<ChannelsAndServices />);
    expect(screen.getByTestId('icon')).toBeTruthy();
  });

  test('applies border classes to non-last items only', async () => {
    renderWithRouter(<ChannelsAndServices />);

    const first = screen.getByText('Internet Banking');
    const second = screen.getByText('Millennium IZI');
    const last = screen.getByText('Linha Millennium bim');

    const firstContainer = first.closest('div');
    const secondContainer = second.closest('div');
    const lastContainer = last.closest('div');

    expect(firstContainer?.className.includes('border-b')).toBe(true);
    expect(secondContainer?.className.includes('border-b')).toBe(true);
    expect(lastContainer?.className.includes('border-b')).toBe(false);
  });

  test('items with null state do not render a State badge', async () => {
    renderWithRouter(<ChannelsAndServices />);

    const item = screen.getByText('Extracto Mensal');
    const container = item.closest('div') as HTMLElement;
    const badge = within(container).queryByRole('img');
    expect(badge).toBeNull();
  });

  test('state badge includes accessible label text (aria-label)', async () => {
    renderWithRouter(<ChannelsAndServices />);
    const badges = screen.getAllByRole('img');
    const label = badges[0]?.getAttribute('aria-label') ?? '';
    expect(label).toMatch(/\((A|B|C|V|I)\)$/);
  });
});
