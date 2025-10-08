import { useCallback, useEffect, useMemo, useState } from 'react';
import { z } from 'zod';

export interface TvPacketsRow {
  id: string;
  operatorName: string;
  reference: string;
  date: string;
  time: string;
  rechargeValue: string;
  channel: string;
  sendState: string;
  error?: string;
}

export type DateRange = {
  start: Date | null;
  end: Date | null;
};

interface UseTvPacketsTableDataProps {
  tvPacketsRows: TvPacketsRow[];
}

export function useTvPacketsTableData({ tvPacketsRows }: UseTvPacketsTableDataProps) {
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });
  const [operator, setOperator] = useState<string>('Todas operadoras');
  const [selectedPhone, setSelectedPhone] = useState<string>('Todos telemóveis');

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
    selectedPhone: z.string().min(1, 'O telemóvel é obrigatório')
  });

  const validateFilters = useCallback(() => {
    try {
      filtersSchema.parse({ dateRange, operator, selectedPhone });
      return { valid: true, error: null };
    } catch (err) {
      if (err instanceof z.ZodError) {
        return { valid: false, error: err.errors[0]?.message || 'Invalid filters' };
      }
      return { valid: false, error: 'Unknown error' };
    }
  }, [dateRange, operator, selectedPhone, filtersSchema]);

  const parseTvPacketsDate = useCallback((dateInput: unknown): Date => {
    const dateStr = typeof dateInput === 'string' ? dateInput : String(dateInput ?? '');

    const [day, month, year] = dateStr.split('/').map(Number);

    if ([day, month, year].some((part) => Number.isNaN(part))) {
      return new Date(NaN);
    }

    return new Date(year, month - 1, day);
  }, []);

  const availableOperators = useMemo(() => {
    const uniqueOperators = new Set(
      tvPacketsRows
        .map((row) => normalizeString(row.operatorName))
        .filter((operator) => operator !== '')
    );
    return Array.from(uniqueOperators).sort();
  }, [tvPacketsRows, normalizeString]);

  const availablePhones = useMemo(() => {
    const uniquePhones = new Set(
      tvPacketsRows
        .map((row) => normalizePhone(row.reference))
        .filter((phone) => phone !== '' && phone !== 'Get_recharge_code')
    );
    return Array.from(uniquePhones).sort();
  }, [tvPacketsRows, normalizePhone]);

  useEffect(() => {
    if (availableOperators.length === 1 && operator === 'Todas operadoras') {
      setOperator(availableOperators[0]);
    }
  }, [availableOperators, operator]);

  useEffect(() => {
    if (availablePhones.length === 1 && selectedPhone === 'Todos telemóveis') {
      setSelectedPhone(availablePhones[0]);
    }
  }, [availablePhones, selectedPhone]);

  const filteredTvPacketsRows = useMemo(() => {
    return tvPacketsRows.filter((row) => {
      const rowDate = parseTvPacketsDate(row.date);
      const rowOperator = normalizeString(row.operatorName);
      const rowPhone = normalizePhone(row.reference);

      const matchDate =
        (!dateRange.start || rowDate >= dateRange.start) &&
        (!dateRange.end || rowDate <= dateRange.end);

      const matchOperator = operator === 'Todas operadoras' || rowOperator === operator;

      const matchPhone =
        selectedPhone === 'Todos telemóveis' || rowPhone === normalizePhone(selectedPhone);

      return matchDate && matchOperator && matchPhone;
    });
  }, [
    tvPacketsRows,
    dateRange,
    operator,
    selectedPhone,
    parseTvPacketsDate,
    normalizeString,
    normalizePhone
  ]);

  return {
    filteredTvPacketsRows,
    availableOperators,
    availablePhones,
    dateRange,
    setDateRange,
    operator,
    setOperator,
    selectedPhone,
    setSelectedPhone,
    validateFilters
  };
}
