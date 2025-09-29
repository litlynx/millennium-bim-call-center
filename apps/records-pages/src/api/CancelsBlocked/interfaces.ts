import type {
  ScriptsSectionDTO,
  TableSectionTypeDTO,
  TransactionHistorySectionDTO
} from 'src/api/CancelsBlocked/validator';

export type UserContactsCancelsType = {
  id: string;
  operatorName: string;
  phoneNumber: string;
  type: string;
  stateSimSwap: string;
  badgeText: string;
};

export interface CancelsUserObjectInterface {
  cancels: UserContactsCancelsType[];
}

export type UserTransactionsCancelsType = {
  id: string;
  channel: string;
  typeTransaction: string;
  amount: string;
  date: string;
  hour: string;
  stateTransaction: string;
};

export interface CancelsUserTransactionsObjectInterface {
  cancels: UserTransactionsCancelsType[];
}

export interface CancelsBlockedInterface {
  table: TableSectionTypeDTO[];
  transactionHistory: TransactionHistorySectionDTO[];
  script: ScriptsSectionDTO;
}
