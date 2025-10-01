import { z } from 'zod';

export const TableSectionDTO = z.object({
  operatorName: z.string(),
  phoneNumber: z.string(),
  type: z.string(),
  stateSimSwap: z.string(),
  badgeText: z.string()
});
export type TableSectionDTO = z.infer<typeof TableSectionDTO>;

export const ScriptsSectionDTO = z.string();
export type ScriptsSectionDTO = z.infer<typeof ScriptsSectionDTO>;

export const AccessesTableResponseDTO = z.object({
  data: z.array(TableSectionDTO)
});

export type AccessesTableResponseType = z.infer<typeof AccessesTableResponseDTO>;

export const AccessesScriptsResponseDTO = z.object({
  data: ScriptsSectionDTO
});

export type AccessesScriptsResponseType = z.infer<typeof AccessesScriptsResponseDTO>;
