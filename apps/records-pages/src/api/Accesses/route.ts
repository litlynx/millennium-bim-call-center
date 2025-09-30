import type { AccessesInterface } from 'src/api/Accesses/interfaces';
import { GetAccessesScripts, GetAccessesTable } from 'src/api/Accesses/service';

export async function GET(): Promise<AccessesInterface> {
  const [tableRes, scriptRes] = await Promise.all([GetAccessesTable(), GetAccessesScripts()]);

  const table = await tableRes.json();
  const script = await scriptRes.json();

  return {
    table,
    script
  };
}
