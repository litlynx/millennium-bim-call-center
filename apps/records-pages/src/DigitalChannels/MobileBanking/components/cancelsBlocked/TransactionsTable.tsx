import { Icon, Popover, Table } from 'shared/components';

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
  accountDestination: string;
  accountOrigin: string;
  error: string;
}

interface TransactionsTableProps {
  data: TransactionRow[];
}

export function TransactionsTable({ data }: TransactionsTableProps) {
  const sortedData = [...data].sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date)));

  const tableData = sortedData.map((row: TransactionRow) => ({
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

            <Popover
              title="Detalhes"
              content={
                <div>
                  <p>
                    <span className="font-semibold">Conta Destino: </span>
                    <span>{row.accountDestination}</span>
                  </p>
                  <p>
                    <span className="font-semibold">Conta Origem: </span>
                    <span>{row.accountOrigin}</span>
                  </p>
                  <p>
                    <span className="font-semibold">Erro: </span>
                    <span>{row.error}</span>
                  </p>
                </div>
              }
              side="right"
              variant="purple"
              button="Fechar"
            >
              <Icon type="eye" className="p-0 h-[11px] w-[18px] cursor-pointer" />
            </Popover>
          </div>
        )
      }
    ]
  }));

  return <Table headers={headersTableTransactions} data={tableData} />;
}
