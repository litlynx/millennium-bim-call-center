import { Icon, Table, Tooltip } from 'shared/components';

const headersTableTvPackets = [
  { key: 'operatorName', label: 'Operadora' },
  { key: 'reference', label: 'Referência' },
  { key: 'date', label: 'Data' },
  { key: 'time', label: 'Hora' },
  { key: 'rechargeValue', label: 'Valor Recarga' },
  { key: 'channel', label: 'Canal' },
  { key: 'sendState', label: 'Estado' }
];

export interface TvPacketsRow {
  id: string;
  operatorName: string;
  reference: string;
  date: string;
  time: string;
  rechargeValue: string;
  channel: string;
  sendState: string;
  error?: string;
}

interface TvPacketsTableProps {
  data: TvPacketsRow[];
}

export function TvPacketsTable({ data }: TvPacketsTableProps) {
  const sortedData = [...data].sort((a, b) => {
    const dateA = new Date(`${a.date.split('/').reverse().join('-')}T${a.time}`);
    const dateB = new Date(`${b.date.split('/').reverse().join('-')}T${b.time}`);
    return Number(dateB) - Number(dateA);
  });

  const tableData = sortedData.map((row: TvPacketsRow) => ({
    ...row,
    cells: [
      { content: row.operatorName },
      { content: row.reference },
      { content: row.date },
      { content: row.time },
      { content: row.rechargeValue },
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
                    ? '[&>svg>g>path]:stroke-red-500'
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

  return <Table headers={headersTableTvPackets} data={tableData} />;
}
