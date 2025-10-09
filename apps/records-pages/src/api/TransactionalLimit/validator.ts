import { z } from 'zod';

export const OperatorStateTableDTO = z.object({
  id: z.string(),
  operatorName: z.string(),
  contractState: z.string(),
  pin2State: z.string()
});
export type OperatorStateTableDTOType = z.infer<typeof OperatorStateTableDTO>;

export const OperatorStateTableResponseDTO = z.object({
  data: z.array(OperatorStateTableDTO)
});
export type OperatorStateTableResponseDTOType = z.infer<typeof OperatorStateTableResponseDTO>;

export const TransactionalLimitsTableDTO = z.object({
  id: z.string(),
  phoneNumber: z.string(),
  transfersLimit: z.string(),
  rechargesLimit: z.string()
});
export type TransactionalLimitsTableDTOType = z.infer<typeof TransactionalLimitsTableDTO>;

export const TrasactionalLimitsTableResponseDTO = z.object({
  data: z.array(TransactionalLimitsTableDTO)
});
export type TrasactionalLimitsTableResponseDTOType = z.infer<
  typeof TrasactionalLimitsTableResponseDTO
>;
