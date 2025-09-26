import { Icon, Table } from 'shared/components';

const headersTableTransactions = [
  { key: 'channel', label: 'Canal' },
  { key: 'type-transaction', label: 'Tipo Transação' },
  { key: 'amount', label: 'Montante' },
  { key: 'date', label: 'Data', className: 'text-right' },
  { key: 'hour', label: 'Hora' },
  { key: 'state-transaction', label: 'Estado da Transacção' }
];

export interface TransactionRow {
  id: string;
  channel: string;
  typeTransaction: string;
  amount: string;
  date: string;
  hour: string;
  stateTransaction: string;
}

interface TransactionsTableProps {
  data: TransactionRow[];
}

export function TransactionsTable({ data }: TransactionsTableProps) {
  const tableData = data.map((row: TransactionRow) => ({
    ...row,
    cells: [
      { content: row.channel },
      { content: row.typeTransaction },
      { content: row.amount },
      { content: row.date },
      { content: row.hour },
      {
        content: (
          <div className="flex items-center gap-2">
            <span>{row.stateTransaction}</span>
            <Icon type="eye" className="p-0 h-[11px] w-[18px] cursor-pointer" />
          </div>
        )
      }
    ]
  }));

  return <Table headers={headersTableTransactions} data={tableData} />;
}
