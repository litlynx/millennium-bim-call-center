import { describe, expect, mock, test } from 'bun:test';
import { fireEvent, render, screen } from '@testing-library/react';
import PersonalData from 'src/Vision360/components/PersonalData/PersonalData';

describe('PersonalData', () => {
  test('renders Card with title and icon', async () => {
    render(<PersonalData />);

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

    render(<PersonalData />);

    const titleBtn = await screen.findByRole('button', { name: /dados pessoais/i });
    fireEvent.click(titleBtn);

    // Check the fresh mock
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/personal-data?details=true');
  });
  test('renders items from mockData', async () => {
    const data = {
      'Nome completo': 'Jacinto Fazenda Protótipo',
      CIF: '0000000'
    } as const;

    render(<PersonalData data={data} />);

    const items = screen.getAllByTestId('card-item');
    expect(items.length).toBe(2);
  });
});
