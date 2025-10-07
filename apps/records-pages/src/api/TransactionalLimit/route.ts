import type { TransactionalLimitInterface } from 'src/api/TransactionalLimit/interfaces';
import {
  GetTransactionalLimitOperatorStateTable,
  GetTransactionalLimitTable
} from 'src/api/TransactionalLimit/service';

export async function GET(): Promise<TransactionalLimitInterface> {
  const [operatorStateRes, transactionalLimitsRes] = await Promise.all([
    GetTransactionalLimitOperatorStateTable(),
    GetTransactionalLimitTable()
  ]).catch((error) => {
    throw new Error(error);
  });

  const operatorStateData = await operatorStateRes.json();
  const transactionalLimitsData = await transactionalLimitsRes.json();

  return {
    operatorStateData,
    transactionalLimitsData
  };
}
