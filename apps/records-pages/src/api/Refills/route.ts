import type { RefillsInterface } from 'src/api/Refills/interfaces';
import {
  GetCredelecTable,
  GetRefillsScripts,
  GetRefillsTable,
  GetTvPacketsTable
} from 'src/api/Refills/service';

export async function GET(): Promise<RefillsInterface> {
  const [CredelecTableRes, RefillsTableRes, TvPacketsRes, RefillsScriptsRes] = await Promise.all([
    GetCredelecTable(),
    GetRefillsTable(),
    GetTvPacketsTable(),
    GetRefillsScripts()
  ]);

  const credelecTable = await CredelecTableRes.json();
  const refillsTable = await RefillsTableRes.json();
  const tvPacketsTable = await TvPacketsRes.json();
  const script = await RefillsScriptsRes.json();

  return {
    credelecTable,
    refillsTable,
    tvPacketsTable,
    script
  };
}
