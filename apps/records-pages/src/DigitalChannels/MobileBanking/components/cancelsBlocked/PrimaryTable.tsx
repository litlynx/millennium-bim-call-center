import { Icon, Table } from 'shared/components';
import { StateBadge } from './StateBadge';

const headersTablePrimary = [
  { key: 'company-name', label: 'Operadora', boldColumn: true },
  { key: 'number-cel', label: 'N.º Telefone' },
  { key: 'type', label: 'Tipo' },
  { key: 'state-sim-swap', label: 'Estado SIM Swap' },
  { key: 'state-contract', label: 'Estado Contracto' }
];

const actionsHeader = { key: 'actions', label: '' };

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
  onBlock?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function PrimaryTable({ data, onBlock, onDelete }: PrimaryTableProps) {
  const hasActions = onBlock || onDelete;
  const headers = hasActions ? [...headersTablePrimary, actionsHeader] : headersTablePrimary;

  const tableData = data.map((row: PrimaryRow) => {
    const baseCells = [
      { content: row.operatorName },
      { content: row.phoneNumber },
      { content: row.type },
      { content: row.stateSimSwap },
      {
        content: (
          <div className="flex justify-center">
            <StateBadge state={row.badgeText} />
          </div>
        )
      }
    ];

    const actionCell = {
      content:
        row.type === 'Principal' ? (
          <div className="flex items-center gap-4">
            {onBlock && (
              <button type="button" onClick={() => onBlock(row.id)}>
                <Icon type="block" className="h-[17px] w-[17px] p-0 cursor-pointer" />
              </button>
            )}
            {onDelete && (
              <button type="button" onClick={() => onDelete(row.id)}>

                <Icon type="trashBin" className="h-[17px] w-[17px] p-0 cursor-pointer" />
              </button>
            )}
          </div>
        ) : null
    };

    return {
      ...row,
      cells: hasActions ? [...baseCells, actionCell] : baseCells
    };
  });

  return <Table headers={headers} data={tableData} />;
}
