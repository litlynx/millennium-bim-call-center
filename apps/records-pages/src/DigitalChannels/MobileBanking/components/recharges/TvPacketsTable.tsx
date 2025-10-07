import { Icon, Popover, Table } from 'shared/components';

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
            <span>{row.sendState}</span>

            <Popover
              title="Detalhes"
              content={
                <div>
                  <p>
                    <span className="font-semibold">Operadora: </span>
                    <span>{row.operatorName}</span>
                  </p>
                  <p>
                    <span className="font-semibold">Referência: </span>
                    <span>{row.reference}</span>
                  </p>
                  <p>
                    <span className="font-semibold">Data/Hora: </span>
                    <span>
                      {row.date} {row.time}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">Canal: </span>
                    <span>{row.channel}</span>
                  </p>
                  {row.error && (
                    <p>
                      <span className="font-semibold">Erro: </span>
                      <span>{row.error}</span>
                    </p>
                  )}
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

  return <Table headers={headersTableTvPackets} data={tableData} />;
}
