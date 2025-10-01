import type { ScriptsSectionDTO, TableSectionDTO } from 'src/api/Accesses/validator';

export interface AccessesInterface {
  table: TableSectionDTO[];
  script: ScriptsSectionDTO;
}
