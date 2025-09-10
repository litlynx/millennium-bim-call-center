import { beforeEach, describe, expect, mock, test } from 'bun:test';
import { fireEvent, render, screen } from '@testing-library/react';

// Use centralized mocks to avoid duplication and conflicts
mock.module(
  'shared/components',
  () => import('../../../../../../packages/shared/src/__mocks__/shared/components')
);
mock.module(
  'react-router',
  () => import('../../../../../../packages/shared/src/__mocks__/react-router')
);

beforeEach(async () => {
  // Just clear the calls, don't reset the mock entirely
  const { navigateSpy } = await import(
    '../../../../../../packages/shared/src/__mocks__/react-router'
  );
  if (navigateSpy.mockClear) {
    navigateSpy.mockClear();
  }
});

async function loadComponent() {
  const mod = await import('./PersonalData');
  return (mod.default ?? mod) as React.FC<{ data?: unknown | null }>;
}

describe('PersonalData', () => {
  test('renders Card with title and icon', async () => {
    const Component = await loadComponent();
    render(<Component />);

    expect(screen.getByTestId('card')).toBeTruthy();
    expect(screen.getByText('Dados Pessoais')).toBeTruthy();
    expect(screen.getByTestId('icon')).toBeTruthy();
  });

  test('clicking the title navigates to the details route', async () => {
    // Create a fresh mock for this test to avoid interference
    const mockNavigate = mock((_path: string) => {});

    // Override the mock for this specific test
    mock.module('react-router', () => ({
      useNavigate: () => mockNavigate
    }));

    const Component = await loadComponent();
    render(<Component />);

    const titleBtn = await screen.findByRole('button', { name: /dados pessoais/i });
    fireEvent.click(titleBtn);

    // Check the fresh mock
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/personal-data?details=true');
  });
  test('renders items from mockData', async () => {
    const Component = await loadComponent();
    const data = {
      'Nome completo': 'Jacinto Fazenda Protótipo',
      CIF: '0000000'
    } as const;

    render(<Component data={data} />);

    const items = screen.getAllByTestId('card-item');
    expect(items.length).toBe(2);
  });
});
