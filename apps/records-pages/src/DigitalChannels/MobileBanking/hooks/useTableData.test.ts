import { describe, expect, it } from 'bun:test';
import { act, renderHook } from '@testing-library/react';
import type { PrimaryRow } from '../components/cancelsBlocked/PrimaryTable';
import type { TransactionRow } from './useTableData';
import { useTableData } from './useTableData';

const primaryRows: PrimaryRow[] = [
  {
    id: 'primary-1',
    operatorName: 'TMcel',
    phoneNumber: '825 816 811',
    type: 'Principal',
    stateSimSwap: 'Desbloqueado',
    badgeText: 'Activo'
  },
  {
    id: 'primary-2',
    operatorName: 'Vodacom',
    phoneNumber: '845 816 811',
    type: 'Secundário',
    stateSimSwap: 'Desbloqueado',
    badgeText: 'Activo'
  }
];

const transactionRows: TransactionRow[] = [
  {
    id: 'tx-1',
    contact: '825816811',
    channel: 'Smart IZI',
    typeTransaction: 'Transferência e-Mola',
    amount: '100,00 MZN',
    date: '01-06-2025',
    hour: '10:00:00',
    stateTransaction: 'Processado',
    accountDestination: '123',
    accountOrigin: '456',
    error: 'Erro 1'
  },
  {
    id: 'tx-2',
    contact: '845816811',
    channel: 'Smart IZI',
    typeTransaction: 'Transferência BIM',
    amount: '200,00 MZN',
    date: '05-06-2025',
    hour: '11:00:00',
    stateTransaction: 'Erro',
    accountDestination: '789',
    accountOrigin: '012',
    error: 'Erro 2'
  }
];

describe('useTableData', () => {
  it('should initialise cancels list, selected contact and available transaction types', () => {
    const { result } = renderHook(() => useTableData({ primaryRows, transactionRows }));

    expect(result.current.cancels).toEqual([
      { number: '825 816 811', type: 'Principal' },
      { number: '845 816 811', type: 'Secundário' }
    ]);
    expect(result.current.selectedContact).toBe('825816811');
    expect(result.current.availableTransactionTypes).toEqual([
      'Transferência BIM',
      'Transferência e-Mola'
    ]);

    const parsedDate = result.current.parseTransactionDate('10-06-2025');
    expect(parsedDate).toBeInstanceOf(Date);
    expect(parsedDate.getFullYear()).toBe(2025);
  });

  it('should filter transactions by status, contact and date range', () => {
    const { result } = renderHook(() => useTableData({ primaryRows, transactionRows }));

    expect(result.current.filteredTransactionRows).toEqual([transactionRows[0]]);

    act(() => {
      result.current.setStatus('Transferência BIM');
    });
    expect(result.current.filteredTransactionRows).toEqual([]);

    act(() => {
      result.current.setSelectedContact('845816811');
    });
    expect(result.current.filteredTransactionRows).toEqual([transactionRows[1]]);

    act(() => {
      result.current.setStatus('Transferência e-Mola');
    });
    expect(result.current.filteredTransactionRows).toEqual([]);

    act(() => {
      result.current.setSelectedContact('825816811');
    });
    expect(result.current.filteredTransactionRows).toEqual([transactionRows[0]]);

    const startDate = new Date(2025, 5, 2); // 02-06-2025
    const endDate = new Date(2025, 5, 4); // 04-06-2025
    act(() => {
      result.current.setDateRange({ start: startDate, end: endDate });
    });
    expect(result.current.filteredTransactionRows).toHaveLength(0);

    act(() => {
      result.current.setDateRange({ start: new Date(2025, 5, 1), end: new Date(2025, 5, 10) });
    });
    expect(result.current.filteredTransactionRows).toEqual([transactionRows[0]]);
  });

  it('should validate filters and surface errors when invalid', () => {
    const { result } = renderHook(() => useTableData({ primaryRows, transactionRows }));

    act(() => {
      result.current.setSelectedContact('');
    });
    let validation = result.current.validateFilters();
    expect(validation.valid).toBe(false);
    expect(validation.error).toBe('O contacto é obrigatório');

    act(() => {
      result.current.setSelectedContact('825816811');
      result.current.setDateRange({ start: new Date(2025, 5, 5), end: new Date(2025, 5, 1) });
    });

    validation = result.current.validateFilters();
    expect(validation.valid).toBe(false);
    expect(validation.error).toBe('A data inicial deve ser anterior ou igual à data final');

    act(() => {
      result.current.setDateRange({ start: null, end: null });
      result.current.setStatus('Transferência e-Mola');
    });

    validation = result.current.validateFilters();
    expect(validation.valid).toBe(true);
    expect(validation.error).toBeNull();
  });
});
