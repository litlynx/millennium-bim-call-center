import { compareDesc, parse } from 'date-fns';
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

const getIconProps = (sendState: string) => {
  switch (sendState) {
    case 'Falha no envio':
      return {
        type: 'exclamation' as const,
        className: 'p-0 h-[18px] w-[18px] [&>svg>g>path]:stroke-red-500'
      };
    case 'Reenviar recarga':
      return {
        type: 'resend' as const,
        className: 'p-0 h-[18px] w-[18px] cursor-pointer'
      };
    default:
      return {
        type: 'check' as const,
        className: 'p-0 h-[18px] w-[18px]'
      };
  }
};

export function TvPacketsTable({ data }: TvPacketsTableProps) {
  const sortedData = [...data].sort((a, b) => {
    const dateA = parse(`${a.date} ${a.time}`, 'dd/MM/yyyy HH:mm', new Date());
    const dateB = parse(`${b.date} ${b.time}`, 'dd/MM/yyyy HH:mm', new Date());
    return compareDesc(dateA, dateB);
  });

  const tableData = sortedData.map((row: TvPacketsRow) => {
    const iconProps = getIconProps(row.sendState);

    return {
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
                <Icon type={iconProps.type} className={iconProps.className} />
              </Tooltip>
            </div>
          )
        }
      ]
    };
  });

  return <Table headers={headersTableTvPackets} data={tableData} />;
}
