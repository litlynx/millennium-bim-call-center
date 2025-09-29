import { z } from 'zod';

export const TableSectionDTO = z.object({
  operatorName: z.string(),
  phoneNumber: z.string(),
  type: z.string(),
  stateSimSwap: z.string(),
  badgeText: z.string()
});
export type TableSectionTypeDTO = z.infer<typeof TableSectionDTO>;

export const TransactionHistorySectionDTO = z.object({
  channel: z.string(),
  contact: z.string(),
  typeTransaction: z.string(),
  amount: z.string(),
  date: z.string(),
  hour: z.string(),
  stateTransaction: z.string()
});
export type TransactionHistorySectionDTO = z.infer<typeof TransactionHistorySectionDTO>;

export const ScriptsSectionDTO = z.string();
export type ScriptsSectionDTO = z.infer<typeof ScriptsSectionDTO>;

export const CancelsBlockedTableResponseDTO = z.object({
  data: z.array(TableSectionDTO)
});
export type CancelsBlockedTableResponseType = z.infer<typeof CancelsBlockedTableResponseDTO>;

export const CancelsBlockedTransactionHistoryResponseDTO = z.object({
  data: z.array(TransactionHistorySectionDTO)
});
export type CancelsBlockedTransactionHistoryResponseType = z.infer<
  typeof CancelsBlockedTransactionHistoryResponseDTO
>;

export const CancelsBlockedScriptsResponseDTO = z.object({
  data: ScriptsSectionDTO
});
export type CancelsBlockedScriptsResponseType = z.infer<typeof CancelsBlockedScriptsResponseDTO>;
