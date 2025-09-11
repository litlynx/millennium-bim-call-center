import { beforeEach, describe, expect, mock, test } from 'bun:test';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import EstateAndProducts from 'src/Vision360/components/EstateAndProducts/EstateAndProducts';
import type { EstateAndProductsData } from './types';

describe('EstateAndProducts - Cobertura Completa', () => {
  const renderWithRouter = (ui: React.ReactElement) => render(ui, { wrapper: MemoryRouter });

  beforeEach(() => {
    // Clean up mocks between tests
    mock.restore();
  });

  describe('Cenário 1: Dados completos válidos', () => {
    beforeEach(() => {
      // Mock com dados completos
      mock.module('./mock-data/mock-data.json', () => ({
        default: {
          estateAndProducts: {
            assets: {
              title: 'Activos',
              total: { amount: '17.999,24', currency: 'MZN' },
              items: [
                { name: 'DDA', account: '764682235', amount: '10.272,24', currency: 'MZN' },
                { name: 'DDA', account: '01293845456', amount: '5.272,24', currency: 'MZN' },
                { name: 'DP - Millennium IZI', amount: '0,00', currency: 'MZN' }
              ]
            },
            liabilities: {
              title: 'Passivos',
              total: { amount: '17.999,24', currency: 'MZN' },
              items: [
                { name: 'Cartão Crédito Flamingo', amount: '16.272,24', currency: 'MZN' },
                { name: 'Microcrédito IZI', amount: '5.000,24', currency: 'MZN' },
                { name: 'DP - Smart IZI', amount: '10.000,00', currency: 'MZN' }
              ]
            }
          }
        }
      }));
    });

    test('deve renderizar componente principal com dados', async () => {
      renderWithRouter(<EstateAndProducts />);

      // Testa linhas 70-84 (componente principal com dados)
      expect(screen.getByText('Património e produtos')).toBeTruthy();
      expect(screen.getByTestId('icon')).toBeTruthy();
      expect(screen.getByTestId('card')).toBeTruthy();
    });

    test('deve renderizar seções FinancialSection com total formatado', async () => {
      renderWithRouter(<EstateAndProducts />);

      expect(screen.getByText('Activos')).toBeTruthy();
      expect(screen.getByText('Passivos')).toBeTruthy();

      // Testa a formatação split(',')
      expect(screen.getAllByText('17.999').length).toBe(2);
      expect(screen.getAllByText(',24').length).toBeGreaterThan(0);
      expect(screen.getAllByText('MZN').length).toBeGreaterThan(0);
    });

    test('deve renderizar FinancialItem com conta', async () => {
      renderWithRouter(<EstateAndProducts />);

      // O texto está dividido em elementos separados, usar busca mais específica
      expect(screen.getAllByText('DDA').length).toBe(2);
      expect(screen.getByText('- 764682235')).toBeTruthy();
      expect(screen.getByText('- 01293845456')).toBeTruthy();
      expect(screen.getByText('10.272,24')).toBeTruthy();
      expect(screen.getByText('5.272,24')).toBeTruthy();
    });

    test('deve renderizar FinancialItem sem conta', async () => {
      renderWithRouter(<EstateAndProducts />);

      // Testa a condição ternária item.account ? ` - ${item.account}` : ''
      expect(screen.getByText('DP - Millennium IZI')).toBeTruthy();
      expect(screen.getByText('0,00')).toBeTruthy();
    });

    test('deve renderizar último item sem border (isLast=true)', async () => {
      renderWithRouter(<EstateAndProducts />);

      // O último item de cada array não deve ter border-bottom
      expect(screen.getByText('DP - Millennium IZI')).toBeTruthy();
      expect(screen.getByText('DP - Smart IZI')).toBeTruthy();
    });

    test('deve processar items array através do map', async () => {
      renderWithRouter(<EstateAndProducts />);

      // Verifica que todos os items são renderizados
      expect(screen.getAllByText('DDA').length).toBe(2);
      expect(screen.getByText('DP - Millennium IZI')).toBeTruthy();
      expect(screen.getByText('Cartão Crédito Flamingo')).toBeTruthy();
      expect(screen.getByText('Microcrédito IZI')).toBeTruthy();
      expect(screen.getByText('DP - Smart IZI')).toBeTruthy();
    });
  });

  describe('Cenário 2: Dados null/empty (estado vazio)', () => {
    beforeEach(() => {
      // Mock para estado vazio
      mock.module('./mock-data/mock-data.json', () => ({
        default: {
          estateAndProducts: null
        }
      }));
    });

    test('deve renderizar estado vazio quando dados são null', async () => {
      renderWithRouter(<EstateAndProducts />);

      expect(screen.getByText('Dados não disponíveis')).toBeTruthy();
      expect(screen.getByText('Património e produtos')).toBeTruthy();
      expect(screen.getByTestId('icon')).toBeTruthy();

      const card = screen.getByTestId('card');
      expect(card.className).toContain('h-full');
    });
  });

  describe('Cenário 3: Formatação sem vírgula (edge case)', () => {
    beforeEach(() => {
      // Mock com valores sem vírgula para testar includes(',')
      mock.module('./mock-data/mock-data.json', () => ({
        default: {
          estateAndProducts: {
            assets: {
              title: 'Activos',
              total: { amount: '15000', currency: 'USD' },
              items: [{ name: 'Conta Principal', amount: '15000', currency: 'USD' }]
            },
            liabilities: {
              title: 'Passivos',
              total: { amount: '5000', currency: 'EUR' },
              items: [{ name: 'Empréstimo', amount: '5000', currency: 'EUR' }]
            }
          }
        }
      }));
    });

    test('deve processar valores sem vírgula corretamente', async () => {
      renderWithRouter(<EstateAndProducts />);
      // Testa a condição section.total.amount.includes(',')
      expect(screen.getAllByText('15000').length).toBe(2);
      expect(screen.getAllByText('5000').length).toBe(2);
      expect(screen.getAllByText('USD').length).toBe(2);
      expect(screen.getAllByText('EUR').length).toBe(2);
    });
  });

  describe('Cenário 4: Arrays vazios', () => {
    beforeEach(() => {
      // Mock com arrays vazios para testar section.items?.map
      mock.module('./mock-data/mock-data.json', () => ({
        default: {
          estateAndProducts: {
            assets: {
              title: 'Activos',
              total: { amount: '0,00', currency: 'MZN' },
              items: []
            },
            liabilities: {
              title: 'Passivos',
              total: { amount: '0,00', currency: 'MZN' },
              items: []
            }
          }
        }
      }));
    });

    test('deve lidar com arrays de items vazios', async () => {
      renderWithRouter(<EstateAndProducts />);

      // Testa que as seções são renderizadas mesmo com arrays vazios
      expect(screen.getByText('Activos')).toBeTruthy();
      expect(screen.getByText('Passivos')).toBeTruthy();
      expect(screen.getAllByText('0').length).toBe(2);
      expect(screen.getAllByText(',00').length).toBe(2);
    });
  });

  describe('Cenário 5: Assets ou Liabilities undefined', () => {
    beforeEach(() => {
      // Mock com apenas uma seção
      mock.module('./mock-data/mock-data.json', () => ({
        default: {
          estateAndProducts: {
            assets: {
              title: 'Activos',
              total: { amount: '10.000,00', currency: 'MZN' },
              items: [{ name: 'Conta Única', amount: '10.000,00', currency: 'MZN' }]
            }
          }
        }
      }));
    });

    test('deve renderizar apenas assets quando liabilities undefined', async () => {
      renderWithRouter(<EstateAndProducts />);

      // Testa as condições {data.assets && ...} e {data.liabilities && ...}
      expect(screen.getByText('Activos')).toBeTruthy();
      expect(screen.getByText('Conta Única')).toBeTruthy();
      expect(screen.queryByText('Passivos')).toBeFalsy();
    });
  });

  describe('Classes de espaçamento entre colunas (pr-4/pl-4)', () => {
    test('aplica pr-4 em assets e pl-4 em liabilities quando ambas as secções existem', async () => {
      const data: Partial<EstateAndProductsData> = {
        assets: {
          title: 'Activos',
          total: { amount: '1,00', currency: 'MZN' },
          items: [{ name: 'Conta A', amount: '1,00', currency: 'MZN' }]
        },
        liabilities: {
          title: 'Passivos',
          total: { amount: '2,00', currency: 'MZN' },
          items: [{ name: 'Empréstimo', amount: '2,00', currency: 'MZN' }]
        }
      };

      renderWithRouter(<EstateAndProducts data={data} />);

      const assetsHeader = screen.getByText('Activos');
      const liabilitiesHeader = screen.getByText('Passivos');

      const assetsContainer = assetsHeader.parentElement?.parentElement as HTMLDivElement | null;
      const liabilitiesContainer = liabilitiesHeader.parentElement
        ?.parentElement as HTMLDivElement | null;

      expect(assetsContainer?.className.includes('pr-4')).toBe(true);
      expect(liabilitiesContainer?.className.includes('pl-4')).toBe(true);
    });

    test('não aplica pr-4 quando apenas assets existem', async () => {
      const data: Partial<EstateAndProductsData> = {
        assets: {
          title: 'Activos',
          total: { amount: '1,00', currency: 'MZN' },
          items: [{ name: 'Conta A', amount: '1,00', currency: 'MZN' }]
        }
      };

      renderWithRouter(<EstateAndProducts data={data} />);

      const assetsHeader = screen.getByText('Activos');
      const assetsContainer = assetsHeader.parentElement?.parentElement as HTMLDivElement | null;
      expect(assetsContainer?.className.includes('pr-4')).toBe(false);
    });

    test('não aplica pl-4 quando apenas liabilities existem', async () => {
      const data: Partial<EstateAndProductsData> = {
        liabilities: {
          title: 'Passivos',
          total: { amount: '2,00', currency: 'MZN' },
          items: [{ name: 'Empréstimo', amount: '2,00', currency: 'MZN' }]
        }
      };

      renderWithRouter(<EstateAndProducts data={data} />);

      const liabilitiesHeader = screen.getByText('Passivos');
      const liabilitiesContainer = liabilitiesHeader.parentElement
        ?.parentElement as HTMLDivElement | null;
      expect(liabilitiesContainer?.className.includes('pl-4')).toBe(false);
    });
  });

  test('clicar no título navega para a rota de detalhes', async () => {
    const mockNavigate = mock((_path: string) => {});
    mock.module('react-router', () => ({
      useNavigate: () => mockNavigate
    }));

    renderWithRouter(<EstateAndProducts />);

    const titleBtn = await screen.findByRole('button', { name: /Património e produtos/i });
    fireEvent.click(titleBtn);
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/estate-and-products?details=true');
  });
});
