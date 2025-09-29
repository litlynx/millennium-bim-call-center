import type { CancelsBlockedInterface } from 'src/api/CancelsBlocked/interfaces';
import {
  GetCancelsBlockedScripts,
  GetCancelsBlockedTable,
  GetCancelsBlockedTransactionHistory
} from 'src/api/CancelsBlocked/service';

export async function GET(): Promise<CancelsBlockedInterface> {
  const [tableRes, transactionHistoryRes, scriptRes] = await Promise.all([
    GetCancelsBlockedTable(),
    GetCancelsBlockedTransactionHistory(),
    GetCancelsBlockedScripts()
  ]);

  const table = await tableRes.json();
  const transactionHistory = await transactionHistoryRes.json();
  const script = await scriptRes.json();

  return {
    table,
    transactionHistory,
    script
  };
}
