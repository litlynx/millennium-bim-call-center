import { useState } from 'react';
import { ButtonDropdown, DatePicker, Icon, Table } from 'shared/components';

const headers = [
  { key: 'channel', label: 'Canal' },
  { key: 'type', label: 'Tipo Transação' },
  { key: 'amount', label: 'Montante' },
  { key: 'date', label: 'Data' },
  { key: 'hour', label: 'Hora' },
  { key: 'state', label: 'Estado da Transacção' }
];

const rawData = [
  {
    id: 'row-1',
    cells: [
      { content: 'Smart IZI' },
      { content: 'Tranferência e-Mola' },
      { content: '123,00 MZN' },
      { content: '02-10-2025' },
      { content: '11:24:12' },
      {
        content: (
          <div className="flex gap-2 items-center">
            Processado
            <Icon type="eye" className="p-0" size="sm" />
          </div>
        ),
        value: 'Processado'
      }
    ]
  },
  {
    id: 'row-2',
    cells: [
      { content: 'Smart IZI' },
      { content: 'Tranferência BIM' },
      { content: '123,00 MZN' },
      { content: '02-08-2025' },
      { content: '11:24:12' },
      {
        content: (
          <div className="flex gap-2 items-center">
            Erro
            <Icon type="eye" className="p-0" size="sm" />
          </div>
        ),
        value: 'Erro'
      }
    ]
  },
  {
    id: 'row-3',
    cells: [
      { content: 'Smart IZI' },
      { content: 'Tranferência e-Mola' },
      { content: '123,00 MZN' },
      { content: '02-09-2025' },
      { content: '11:24:12' },
      {
        content: (
          <div className="flex gap-2 items-center">
            Processado
            <Icon type="eye" className="p-0" size="sm" />
          </div>
        ),
        value: 'Processado'
      }
    ]
  }
];

export default function PersonalDataPage() {
  const isParamsTrue = new URLSearchParams(window.location.search).get('details') === 'true';

  const [stateFilter, setStateFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null
  });

  const parseDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const filteredData = rawData.filter((row) => {
    const stateCell = row.cells.find((c) => c.value);
    const dateCell = row.cells[3];
    const rowDate = parseDate(dateCell.content as string);

    const matchState = stateFilter ? stateCell?.value === stateFilter : true;

    const matchDate =
      (!dateRange.start || rowDate >= dateRange.start) &&
      (!dateRange.end || rowDate <= dateRange.end);

    return matchState && matchDate;
  });

  return (
    <div className="p-4">
      {isParamsTrue ? (
        <>
          <h1 className="text-2xl font-bold mb-4">Detalhe de dados pessoais</h1>
          <p>Aqui estão os detalhes do dados pessoais...</p>

          <div className="flex gap-4">
            <ButtonDropdown
              button={<span>Opções</span>}
              content={
                <div className="flex flex-col">
                  <button type="button" className="px-3 py-2 text-left hover:bg-gray-100">
                    915193044
                  </button>
                </div>
              }
            />

            <DatePicker
              onChange={(range) => setDateRange({ start: range.startDate, end: range.endDate })}
            />

            <ButtonDropdown
              button={<span>{stateFilter ?? 'Tipo Operação'}</span>}
              content={
                <div className="flex flex-col">
                  <button
                    type="button"
                    className="px-3 py-2 text-left hover:bg-gray-100"
                    onClick={() => setStateFilter(null)}
                  >
                    Todos
                  </button>
                  <button
                    type="button"
                    className="px-3 py-2 text-left hover:bg-gray-100"
                    onClick={() => setStateFilter('Processado')}
                  >
                    Processado
                  </button>
                  <button
                    type="button"
                    className="px-3 py-2 text-left hover:bg-gray-100"
                    onClick={() => setStateFilter('Erro')}
                  >
                    Erro
                  </button>
                </div>
              }
            />
          </div>

          <Table headers={headers} data={filteredData} />
        </>
      ) : (
        <p>Sem detalhes disponíveis.</p>
      )}
    </div>
  );
}
