import { describe, expect, it, mock } from 'bun:test';
import { fireEvent, render, screen, within } from '@testing-library/react';
import {
  createSharedComponentsMock,
  registerSharedComponentsMock
} from '../../../__mocks__/sharedComponents';

const sharedComponentsMock = createSharedComponentsMock();

registerSharedComponentsMock(() => sharedComponentsMock);

import type { PrimaryRow } from './PrimaryTable';

const { PrimaryTable } = await import('./PrimaryTable');

describe('PrimaryTable', () => {
  it('should render rows with badges and trigger block/delete actions', () => {
    const rows: PrimaryRow[] = [
      {
        id: 'row-1',
        operatorName: 'TMcel',
        phoneNumber: '825 816 811',
        type: 'Principal',
        stateSimSwap: 'Desbloqueado',
        badgeText: 'Activo'
      },
      {
        id: 'row-2',
        operatorName: 'Vodacom',
        phoneNumber: '845 816 811',
        type: 'Secundário',
        stateSimSwap: 'Desbloqueado',
        badgeText: 'Inativo'
      }
    ];

    const onBlock = mock(() => {});
    const onDelete = mock(() => {});

    render(<PrimaryTable data={rows} onBlock={onBlock} onDelete={onDelete} />);

    expect(screen.getByTestId('badge-active').textContent).toContain('Activo');
    expect(screen.getByTestId('badge-inactive').textContent).toContain('Inativo');

    const firstRow = screen.getAllByTestId('table-row')[0];
    const actionButtons = within(firstRow).getAllByRole('button');
    expect(actionButtons).toHaveLength(2);

    fireEvent.click(actionButtons[0]);
    expect(onBlock).toHaveBeenCalledWith('row-1');

    fireEvent.click(actionButtons[1]);
    expect(onDelete).toHaveBeenCalledWith('row-1');
  });
});
