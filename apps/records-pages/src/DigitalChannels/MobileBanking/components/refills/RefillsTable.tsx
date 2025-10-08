import { Icon, Table, Tooltip } from 'shared/components';

const headersTableTransactions = [
  { key: 'operatorName', label: 'Operadora' },
  { key: 'sendPhone', label: 'Telefone enviado' },
  { key: 'rechargeValue', label: 'Valor Recarga' },
  { key: 'dateTime', label: 'Data', className: 'Data' },
  { key: 'channel', label: 'Canal' },
  { key: 'sendState', label: 'Reenviar' }
];

export interface RechargesRow {
  id: string;
  operatorName: string;
  sendPhone: string;
  rechargeValue: string;
  dateTime: string;
  channel: string;
  sendState: string;
  error?: string;
}

interface RechargesTableProps {
  data: RechargesRow[];
}

export function RechargesTable({ data }: RechargesTableProps) {
  const sortedData = [...data].sort(
    (a, b) => Number(new Date(b.dateTime)) - Number(new Date(a.dateTime))
  );

  const tableData = sortedData.map((row: RechargesRow) => ({
    ...row,
    cells: [
      { content: row.operatorName },
      { content: row.sendPhone },
      { content: row.rechargeValue },
      { content: row.dateTime },
      { content: row.channel },
      {
        content: (
          <div className="flex items-center gap-2">
            <Tooltip content={row.sendState} variant="dark" simple={true}>
              <Icon
                type={
                  row.sendState === 'Falha no envio'
                    ? 'exclamation'
                    : row.sendState === 'Reenviar recarga'
                      ? 'resend'
                      : row.sendState === 'Enviada com sucesso'
                        ? 'check'
                        : 'eye'
                }
                className={`p-0 h-[18px] w-[18px] ${
                  row.sendState === 'Falha no envio'
                    ? '[&>svg>g>path]:stroke-primary-500'
                    : row.sendState === 'Reenviar recarga'
                      ? 'cursor-pointer'
                      : ''
                }`}
              />
            </Tooltip>
          </div>
        )
      }
    ]
  }));

  return <Table headers={headersTableTransactions} data={tableData} />;
}
