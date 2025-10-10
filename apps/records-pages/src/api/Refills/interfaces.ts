import type {
  ScriptsSectionDTO,
  TableCredelecTypeDTO,
  TableRefillsTypeDTO,
  TableTvPacketsTypeDTO
} from 'src/api/Refills/validator';

export interface RefillsInterface {
  credelecTable: TableCredelecTypeDTO[];
  refillsTable: TableRefillsTypeDTO[];
  tvPacketsTable: TableTvPacketsTypeDTO[];
  script: ScriptsSectionDTO;
}
