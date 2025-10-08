import { Icon, Table, Tooltip } from 'shared/components';

const headersTableCredelec = [
  { key: 'date', label: 'Data' },
  { key: 'time', label: 'Hora' },
  { key: 'sendPhone', label: 'Telefone enviado' },
  { key: 'counterNumber', label: 'Número do contador' },
  { key: 'rechargeValue', label: 'Valor Recarga' },
  { key: 'sendState', label: 'Estado' }
];

export interface CredelecRow {
  id: string;
  date: string;
  time: string;
  sendPhone: string;
  counterNumber: string;
  rechargeValue: string;
  sendState: string;
  error?: string;
}

interface CredelecTableProps {
  data: CredelecRow[];
}

export function CredelecTable({ data }: CredelecTableProps) {
  const sortedData = [...data].sort((a, b) => {
    const dateA = new Date(`${a.date.split('/').reverse().join('-')}T${a.time}`);
    const dateB = new Date(`${b.date.split('/').reverse().join('-')}T${b.time}`);
    return Number(dateB) - Number(dateA);
  });

  const tableData = sortedData.map((row: CredelecRow) => ({
    ...row,
    cells: [
      { content: row.date },
      { content: row.time },
      { content: row.sendPhone },
      { content: row.counterNumber },
      { content: row.rechargeValue },
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

  return <Table headers={headersTableCredelec} data={tableData} />;
}
