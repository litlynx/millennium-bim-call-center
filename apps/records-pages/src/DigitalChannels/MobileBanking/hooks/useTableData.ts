import { useCallback, useEffect, useMemo, useState } from 'react';
import { z } from 'zod';
import type { PrimaryRow } from '../components/cancelsBlocked/PrimaryTable';
import type { TransactionRow as BaseTransactionRow } from '../components/cancelsBlocked/TransactionsTable';

export interface TransactionRow extends BaseTransactionRow {
  contact?: string;
}

export type DateRange = {
  start: Date | null;
  end: Date | null;
};

interface UseTableDataProps {
  primaryRows: PrimaryRow[];
  transactionRows: TransactionRow[];
}

export function useTableData({ primaryRows, transactionRows }: UseTableDataProps) {
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });
  const [status, setStatus] = useState<string>('Todas');

  const cancels = useMemo(
    () =>
      primaryRows.map((row) => ({
        number: row.phoneNumber,
        type: row.type
      })),
    [primaryRows]
  );

  const principalCancel = useMemo(
    () =>
      cancels.find((c) => c.type === 'Principal')?.number.replace(/\s/g, '') ||
      (cancels[0]?.number ? cancels[0].number.replace(/\s/g, '') : ''),
    [cancels]
  );

  const [selectedContact, setSelectedContact] = useState<string>(principalCancel);

  // Auto-update selectedContact when principalCancel changes (when cancels array changes)
  useEffect(() => {
    setSelectedContact(principalCancel);
  }, [principalCancel]);

  const filtersSchema = z.object({
    dateRange: z
      .object({
        start: z.date({ invalid_type_error: 'Data inicial inválida' }).nullable(),
        end: z.date({ invalid_type_error: 'Data final inválida' }).nullable()
      })
      .refine(
        (range) => {
          if (range.start && range.end) {
            return range.start <= range.end;
          }
          return true;
        },
        { message: 'A data inicial deve ser anterior ou igual à data final' }
      ),
    status: z.string().min(1, 'O estado é obrigatório'),
    selectedContact: z.string().min(1, 'O contacto é obrigatório')
  });

  const validateFilters = useCallback(() => {
    try {
      filtersSchema.parse({ dateRange, status, selectedContact });
      return { valid: true, error: null };
    } catch (err) {
      if (err instanceof z.ZodError) {
        return { valid: false, error: err.errors[0]?.message || 'Invalid filters' };
      }
      return { valid: false, error: 'Unknown error' };
    }
  }, [dateRange, status, selectedContact, filtersSchema]);

  const parseTransactionDate = useCallback((dateStr: string): Date => {
    const [day, month, year] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }, []);

  const availableTransactionTypes = useMemo(() => {
    const uniqueTypes = new Set(
      transactionRows
        .map((row) => row.typeTransaction)
        .filter((type) => type && type.trim() !== '') // Filter out empty/null values
    );
    return Array.from(uniqueTypes).sort(); // Sort alphabetically for consistent order
  }, [transactionRows]);

  const filteredTransactionRows = useMemo(() => {
    return transactionRows.filter((row) => {
      const rowDate = parseTransactionDate(row.date);
      const matchDate =
        (!dateRange.start || rowDate >= dateRange.start) &&
        (!dateRange.end || rowDate <= dateRange.end);
      const matchStatus = status === 'Todas' || row.typeTransaction === status;
      const rowContactNormalized = row.contact?.replace(/\s/g, '') || '';
      const selectedContactNormalized = selectedContact.replace(/\s/g, '');
      const matchContact = !selectedContact || rowContactNormalized === selectedContactNormalized;
      return matchDate && matchStatus && matchContact;
    });
  }, [transactionRows, dateRange, status, selectedContact, parseTransactionDate]);

  return {
    filteredTransactionRows,
    cancels,
    availableTransactionTypes,
    dateRange,
    setDateRange,
    status,
    setStatus,
    selectedContact,
    setSelectedContact,
    parseTransactionDate,
    validateFilters
  };
}
