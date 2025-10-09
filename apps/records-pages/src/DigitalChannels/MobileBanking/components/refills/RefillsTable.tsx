import { Icon, Table, Tooltip } from 'shared/components';

const headersTableRefills = [
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
  contact: string;
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

const getIconProps = (sendState: string) => {
  switch (sendState) {
    case 'Falha no envio':
      return {
        type: 'exclamation' as const,
        className: 'p-0 h-[18px] w-[18px] [&>svg>g>path]:stroke-primary-500'
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

export function RechargesTable({ data }: RechargesTableProps) {
  const sortedData = [...data].sort(
    (a, b) => Number(new Date(b.dateTime)) - Number(new Date(a.dateTime))
  );

  const tableData = sortedData.map((row: RechargesRow) => {
    const iconProps = getIconProps(row.sendState);

    return {
      ...row,
      cells: [
        { content: row.operatorName },
        { content: row.sendPhone },
        { content: row.rechargeValue },
        { content: row.dateTime },
        { content: row.channel },
        {
          content: (
            <div className="flex justify-center items-center gap-2">
              <Tooltip content={row.sendState} variant="dark" simple={true}>
                <Icon type={iconProps.type} className={iconProps.className} />
              </Tooltip>
            </div>
          )
        }
      ]
    };
  });

  return <Table headers={headersTableRefills} data={tableData} />;
}
