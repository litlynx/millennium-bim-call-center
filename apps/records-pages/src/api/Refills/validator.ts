import { z } from 'zod';

export const TableCredelecDTO = z.object({
  id: z.string(),
  date: z.string(),
  time: z.string(),
  contact: z.string(),
  sendPhone: z.string(),
  counterNumber: z.string(),
  rechargeValue: z.string(),
  sendState: z.string()
});
export type TableCredelecTypeDTO = z.infer<typeof TableCredelecDTO>;

export const TableRefillsDTO = z.object({
  id: z.string(),
  operatorName: z.string(),
  contact: z.string(),
  sendPhone: z.string(),
  rechargeValue: z.string(),
  dateTime: z.string(),
  channel: z.string(),
  sendState: z.string()
});
export type TableRefillsTypeDTO = z.infer<typeof TableRefillsDTO>;

export const TableTvPacketsDTO = z.object({
  id: z.string(),
  operatorName: z.string(),
  contact: z.string(),
  reference: z.string(),
  date: z.string(),
  time: z.string(),
  rechargeValue: z.string(),
  channel: z.string(),
  sendState: z.string()
});

export type TableTvPacketsTypeDTO = z.infer<typeof TableTvPacketsDTO>;

export const ScriptsSectionDTO = z.string();
export type ScriptsSectionDTO = z.infer<typeof ScriptsSectionDTO>;

export const TableCredelecResponseDTO = z.object({
  data: z.array(TableCredelecDTO)
});
export type TableCredelecResponseType = z.infer<typeof TableCredelecResponseDTO>;

export const TableRefillsResponseDTO = z.object({
  data: z.array(TableRefillsDTO)
});
export type TableRefillsResponseType = z.infer<typeof TableRefillsResponseDTO>;

export const TableTvPacketsResponseDTO = z.object({
  data: z.array(TableTvPacketsDTO)
});
export type TableTvPacketsResponseType = z.infer<typeof TableTvPacketsResponseDTO>;

export const RefillsScriptsResponseDTO = z.object({
  data: ScriptsSectionDTO
});
export type RefillsScriptsResponseType = z.infer<typeof RefillsScriptsResponseDTO>;
