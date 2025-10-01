import { describe, expect, it } from 'bun:test';
import { render, screen, within } from '@testing-library/react';
import {
  createSharedComponentsMock,
  registerSharedComponentsMock
} from '../../../__mocks__/sharedComponents';

const sharedComponentsMock = createSharedComponentsMock();

registerSharedComponentsMock(() => sharedComponentsMock);

import type { TransactionRow } from './TransactionsTable';

const { TransactionsTable } = await import('./TransactionsTable');

describe('TransactionsTable', () => {
  it('should render transaction data and configure popovers with details', () => {
    const rows: TransactionRow[] = [
      {
        id: 'tx-1',
        channel: 'Smart IZI',
        typeTransaction: 'Transferência e-Mola',
        amount: '123,00 MZN',
        date: '02-06-2025',
        hour: '11:24:12',
        stateTransaction: 'Processado',
        accountDestination: '1226144894',
        accountOrigin: '764682235',
        error: 'Erro de processamento'
      }
    ];

    render(<TransactionsTable data={rows} />);

    const tableRows = screen.getAllByTestId('table-row');
    expect(tableRows).toHaveLength(1);

    const firstRowCells = within(tableRows[0]).getAllByTestId('table-cell');
    expect(firstRowCells).toHaveLength(6);

    const popover = screen.getByTestId('popover');
    expect(popover.getAttribute('data-side')).toBe('right');
    expect(popover.getAttribute('data-variant')).toBe('purple');
    expect(popover.getAttribute('data-button')).toBe('Fechar');

    const popoverContent = screen.getByTestId('popover-content');
    expect(popoverContent.textContent).toContain('Conta Destino');
    expect(popoverContent.textContent).toContain('1226144894');
    expect(popoverContent.textContent).toContain('Erro de processamento');
  });
});
