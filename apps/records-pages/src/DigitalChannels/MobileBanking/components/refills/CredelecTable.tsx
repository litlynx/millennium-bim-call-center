import { compareDesc, parse } from 'date-fns';
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

export function CredelecTable({ data }: CredelecTableProps) {
  const sortedData = [...data].sort((a, b) => {
    const dateA = parse(`${a.date} ${a.time}`, 'dd/MM/yyyy HH:mm', new Date());
    const dateB = parse(`${b.date} ${b.time}`, 'dd/MM/yyyy HH:mm', new Date());
    return compareDesc(dateA, dateB);
  });

  const tableData = sortedData.map((row: CredelecRow) => {
    const iconProps = getIconProps(row.sendState);

    return {
      ...row,
      cells: [
        { content: row.date },
        { content: row.time },
        { content: row.sendPhone },
        { content: row.counterNumber },
        { content: row.rechargeValue },
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

  return <Table headers={headersTableCredelec} data={tableData} />;
}
