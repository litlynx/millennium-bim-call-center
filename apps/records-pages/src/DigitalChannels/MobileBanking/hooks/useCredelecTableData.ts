import { useCallback, useEffect, useMemo, useState } from 'react';
import { z } from 'zod';

export interface CredelecRow {
  id: string;
  date: string;
  time: string;
  contact: string;
  sendPhone: string;
  counterNumber: string;
  rechargeValue: string;
  sendState: string;
  error?: string;
}

export type DateRange = {
  start: Date | null;
  end: Date | null;
};

interface UseCredelecTableDataProps {
  credelecRows: CredelecRow[];
}

export function useCredelecTableData({ credelecRows }: UseCredelecTableDataProps) {
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });
  const [selectedPhone, setSelectedPhone] = useState<string>('Todos telemóveis');

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
    selectedPhone: z.string().min(1, 'O telemóvel é obrigatório')
  });

  const validateFilters = useCallback(() => {
    try {
      filtersSchema.parse({ dateRange, selectedPhone });
      return { valid: true, error: null };
    } catch (err) {
      if (err instanceof z.ZodError) {
        return { valid: false, error: err.errors[0]?.message || 'Invalid filters' };
      }
      return { valid: false, error: 'Unknown error' };
    }
  }, [dateRange, selectedPhone, filtersSchema]);

  const parseCredelecDate = useCallback((dateInput: unknown): Date => {
    const dateStr = typeof dateInput === 'string' ? dateInput : String(dateInput ?? '');

    const [day, month, year] = dateStr.split('/').map(Number);

    if ([day, month, year].some((part) => Number.isNaN(part))) {
      return new Date(NaN);
    }

    return new Date(year, month - 1, day);
  }, []);

  const availableContacts = useMemo(() => {
    const uniquePhones = new Set(
      credelecRows.map((row) => normalizePhone(row.contact)).filter((phone) => phone !== '')
    );
    return Array.from(uniquePhones).sort();
  }, [credelecRows, normalizePhone]);

  useEffect(() => {
    if (availableContacts.length === 1 && selectedPhone === 'Todos telemóveis') {
      setSelectedPhone(availableContacts[0]);
    }
  }, [availableContacts, selectedPhone]);

  const filteredCredelecRows = useMemo(() => {
    return credelecRows.filter((row) => {
      const rowDate = parseCredelecDate(row.date);
      const rowPhone = normalizePhone(row.contact);

      const matchDate =
        (!dateRange.start || rowDate >= dateRange.start) &&
        (!dateRange.end || rowDate <= dateRange.end);

      const matchPhone =
        selectedPhone === 'Todos telemóveis' || rowPhone === normalizePhone(selectedPhone);

      return matchDate && matchPhone;
    });
  }, [credelecRows, dateRange, selectedPhone, parseCredelecDate, normalizePhone]);

  return {
    filteredCredelecRows,
    availableContacts,
    dateRange,
    setDateRange,
    selectedPhone,
    setSelectedPhone,
    validateFilters
  };
}
