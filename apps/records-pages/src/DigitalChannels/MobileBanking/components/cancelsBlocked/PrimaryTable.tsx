import { Badge, Icon, Table } from 'shared/components';

const headersTablePrimary = [
  { key: 'company-name', label: 'Operadora', boldColumn: true },
  { key: 'number-cel', label: 'N.º Telefone' },
  { key: 'type', label: 'Tipo' },
  { key: 'state-sim-swap', label: 'Estado SIM Swap' },
  { key: 'state-contract', label: 'Estado Contracto' },
  { key: 'actions', label: '' }
];

export interface PrimaryRow {
  id: string;
  operatorName: string;
  phoneNumber: string;
  type: string;
  stateSimSwap: string;
  badgeText: string;
}

interface PrimaryTableProps {
  data: PrimaryRow[];
  onBlock: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PrimaryTable({ data, onBlock, onDelete }: PrimaryTableProps) {
  const tableData = data.map((row: PrimaryRow) => ({
    ...row,
    cells: [
      { content: row.operatorName },
      { content: row.phoneNumber },
      { content: row.type },
      { content: row.stateSimSwap },
      {
        content: (
          <div className="flex justify-center">
            <Badge variant={row.badgeText === 'Inativo' ? 'inactive' : 'active'}>
              {row.badgeText}
            </Badge>
          </div>
        )
      },
      {
        content:
          row.type === 'Principal' ? (
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => onBlock(row.id)}>
                <Icon type="block" className="h-[17px] w-[17px] p-0 cursor-pointer" />
              </button>
              <button type="button" onClick={() => onDelete(row.id)}>
                <Icon type="trashBin" className="h-[17px] w-[17px] p-0 cursor-pointer" />
              </button>
            </div>
          ) : null
      }
    ]
  }));

  return <Table headers={headersTablePrimary} data={tableData} />;
}
