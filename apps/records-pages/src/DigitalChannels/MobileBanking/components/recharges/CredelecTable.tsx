import { Icon, Popover, Table } from 'shared/components';

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
            <span>{row.sendState}</span>

            <Popover
              title="Detalhes"
              content={
                <div>
                  <p>
                    <span className="font-semibold">Data/Hora: </span>
                    <span>
                      {row.date} {row.time}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">Número do contador: </span>
                    <span>{row.counterNumber}</span>
                  </p>
                  <p>
                    <span className="font-semibold">Valor: </span>
                    <span>{row.rechargeValue}</span>
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

  return <Table headers={headersTableCredelec} data={tableData} />;
}
