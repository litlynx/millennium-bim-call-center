import type {
  OperatorStateTableDTOType,
  TransactionalLimitsTableDTOType
} from 'src/api/TransactionalLimit/validator';

export type OperatorStatusTransactionalLimitType = {
  id: string;
  operatorName: string;
  contractState: string;
  pin2State: string;
};

export interface CancelsUserObjectInterface {
  transactionalsLimits: OperatorStatusTransactionalLimitType[];
}

export type TransactionalLimitType = {
  id: string;
  phoneNumber: string;
  transfersLimit: string;
  rechargesLimit: string;
};

export interface TransactionalLimitObjectInterface {
  transactionalsLimits: TransactionalLimitType[];
}

export interface TransactionalLimitInterface {
  operatorStateData: OperatorStateTableDTOType[];
  transactionalLimitsData: TransactionalLimitsTableDTOType[];
}
