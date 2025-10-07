import { useCallback, useMemo, useState } from 'react';
import { z } from 'zod';
import type { RechargesRow } from '../components/recharges/RechargesTable';

export type DateRange = {
  start: Date | null;
  end: Date | null;
};

interface UseRechargesTableDataProps {
  rechargesRows: RechargesRow[];
}

export function useRechargesTableData({ rechargesRows }: UseRechargesTableDataProps) {
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });
  const [operator, setOperator] = useState<string>('Todas operadoras');
  const [selectedPhone, setSelectedPhone] = useState<string>('Todos telemóveis');
  const [destinationNumber, setDestinationNumber] = useState<string>('');

  const normalizeString = useCallback((value: unknown) => {
    if (typeof value === 'string') {
      return value.trim();
    }
    if (value === undefined || value === null) {
      return '';
    }
    return String(value).trim();
  }, []);

  const normalizePhone = useCallback((value: unknown) => {
    if (typeof value === 'string') {
      return value.replace(/\s/g, '');
    }
    if (typeof value === 'number') {
      return String(value);
    }
    return '';
  }, []);

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
    operator: z.string().min(1, 'A operadora é obrigatória'),
    selectedPhone: z.string().min(1, 'O telemóvel é obrigatório'),
    destinationNumber: z.string()
  });

  const validateFilters = useCallback(() => {
    try {
      filtersSchema.parse({ dateRange, operator, selectedPhone, destinationNumber });
      return { valid: true, error: null };
    } catch (err) {
      if (err instanceof z.ZodError) {
        return { valid: false, error: err.errors[0]?.message || 'Invalid filters' };
      }
      return { valid: false, error: 'Unknown error' };
    }
  }, [dateRange, operator, selectedPhone, destinationNumber, filtersSchema]);

  const parseRechargeDate = useCallback((dateInput: unknown): Date => {
    const dateStr = typeof dateInput === 'string' ? dateInput : String(dateInput ?? '');

    if (dateStr.includes(',')) {
      const [datePart] = dateStr.split(', ');
      const [day, month, year] = datePart.split('/').map(Number);

      if ([day, month, year].some((part) => Number.isNaN(part))) {
        return new Date(NaN);
      }

      return new Date(year, month - 1, day);
    }

    return new Date(NaN);
  }, []);

  const availableOperators = useMemo(() => {
    const uniqueOperators = new Set(
      rechargesRows
        .map((row) => normalizeString(row.operatorName))
        .filter((operator) => operator !== '')
    );
    return Array.from(uniqueOperators).sort();
  }, [rechargesRows, normalizeString]);

  const availablePhones = useMemo(() => {
    const uniquePhones = new Set(
      rechargesRows
        .map((row) => normalizePhone(row.sendPhone))
        .filter((phone) => phone !== '' && phone !== 'Get_recharge_code')
    );
    return Array.from(uniquePhones).sort();
  }, [rechargesRows, normalizePhone]);

  const filteredRechargesRows = useMemo(() => {
    return rechargesRows.filter((row) => {
      const rowDate = parseRechargeDate(row.dateTime);
      const rowOperator = normalizeString(row.operatorName);
      const rowPhone = normalizePhone(row.sendPhone);
      const rowDestination = normalizePhone(row.sendPhone);

      const matchDate =
        (!dateRange.start || rowDate >= dateRange.start) &&
        (!dateRange.end || rowDate <= dateRange.end);

      const matchOperator = operator === 'Todas operadoras' || rowOperator === operator;

      const matchPhone =
        selectedPhone === 'Todos telemóveis' || rowPhone === normalizePhone(selectedPhone);

      const matchDestination =
        !destinationNumber || rowDestination.includes(normalizePhone(destinationNumber));

      return matchDate && matchOperator && matchPhone && matchDestination;
    });
  }, [
    rechargesRows,
    dateRange,
    operator,
    selectedPhone,
    destinationNumber,
    parseRechargeDate,
    normalizeString,
    normalizePhone
  ]);

  return {
    filteredRechargesRows,
    availableOperators,
    availablePhones,
    dateRange,
    setDateRange,
    operator,
    setOperator,
    selectedPhone,
    setSelectedPhone,
    destinationNumber,
    setDestinationNumber,
    validateFilters
  };
}
