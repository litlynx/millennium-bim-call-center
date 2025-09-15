import { z } from 'zod';

export const FinancialItemDTO = z.object({
  name: z.string(),
  account: z.string().optional(),
  amount: z.string(),
  currency: z.string()
});

export type FinancialItemDTO = z.infer<typeof FinancialItemDTO>;

export const FinancialSectionDTO = z.object({
  title: z.string(),
  total: z.object({
    amount: z.string(),
    currency: z.string()
  }),
  items: z.array(FinancialItemDTO)
});

export type FinancialSectionDTO = z.infer<typeof FinancialSectionDTO>;

export const EstateAndProductsDTO = z.object({
  assets: FinancialSectionDTO,
  liabilities: FinancialSectionDTO
});

export type EstateAndProductsDTO = z.infer<typeof EstateAndProductsDTO>;
