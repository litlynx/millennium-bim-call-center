import type * as React from 'react';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  Badge,
  Button,
  ButtonDropdown,
  type CardTabItem,
  CardTabs,
  DatePicker,
  Icon,
  PageHeader,
  ScriptDetail,
  Table,
  TextArea,
  useTextArea
} from 'shared/components';
import { useUserStore } from 'shared/stores';

const headersTablePrimary = [
  { key: 'company-name', label: 'Operadora', boldColumn: true },
  { key: 'number-cel', label: 'N.º Telefone' },
  { key: 'type', label: 'Tipo' },
  { key: 'state-sim-swap', label: 'Estado SIM Swap' },
  { key: 'state-contract', label: 'Estado Contrato' },
  { key: 'actions', label: '' }
];

const dataTablePrimary = [
  {
    id: 'row-1',
    cells: [
      { content: 'TMcel' },
      { content: '825 816 811' },
      { content: 'Principal' },
      { content: 'Desbloqueado' },
      {
        content: (
          <div className="flex justify-center">
            <Badge variant="active">Activo</Badge>
          </div>
        )
      },
      {
        content: (
          <div className="flex items-center gap-2">
            <Icon type="block" className="w-[22px] p-0 cursor-pointer" />
            <Icon type="trashBin" className="w-[22px] p-0 cursor-pointer" />
          </div>
        )
      }
    ]
  },
  {
    id: 'row-2',
    cells: [
      { content: 'Vodacom' },
      { content: '845 816 811' },
      { content: 'Secundário' },
      { content: 'Desbloqueado' },
      {
        content: (
          <div className="flex justify-center">
            <Badge variant="active">Activo</Badge>
          </div>
        )
      },
      {
        content: <div></div>
      }
    ]
  }
];

const headersTableTransactions = [
  { key: 'channel', label: 'Canal' },
  { key: 'type-transaction', label: 'Tipo Transação' },
  { key: 'amount', label: 'Montante' },
  { key: 'date', label: 'Data', className: 'text-right' },
  { key: 'hour', label: 'Hora' },
  { key: 'state-transaction', label: 'Estado da Transacção' }
];

const dataTableTransactions = [
  {
    id: 'row-1',
    contact: '825816811',
    cells: [
      { content: 'Smart IZI' },
      { content: 'Transferência e-Mola' },
      { content: '123,00 MZN' },
      { content: '02-05-2025' },
      { content: '11:24:12' },
      {
        content: (
          <div className="flex items-center gap-2">
            <span>Processado</span>
            <Icon type="eye" size="sm" className="p-0 cursor-pointer" />
          </div>
        ),
        value: 'Processado'
      }
    ]
  },
  {
    id: 'row-2',
    contact: '845816811',
    cells: [
      { content: 'Smart IZI' },
      { content: 'Transferência BIM' },
      { content: '123,00 MZN' },
      { content: '02-06-2025' },
      { content: '11:24:12' },
      {
        content: (
          <div className="flex items-center gap-2">
            <span>Erro</span>
            <Icon type="eye" size="sm" className="p-0 cursor-pointer" />
          </div>
        ),
        value: 'Erro'
      }
    ]
  },
  {
    id: 'row-3',
    contact: '825816811',
    cells: [
      { content: 'Smart IZI' },
      { content: 'Transferência e-Mola' },
      { content: '123,00 MZN' },
      { content: '02-07-2025' },
      { content: '11:24:12' },
      {
        content: (
          <div className="flex items-center gap-2">
            <span>Processado</span>
            <Icon type="eye" size="sm" className="p-0 cursor-pointer" />
          </div>
        ),
        value: 'Processado'
      }
    ]
  }
];

type DateRange = {
  start: Date | null;
  end: Date | null;
};

const TransactionHistorySection: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    start: null,
    end: null
  });
  const [status, setStatus] = useState<string>('Todas');

  const cancels = dataTablePrimary.map((row) => ({
    number: row.cells[1].content as string,
    type: row.cells[2].content as string
  }));

  const principalCancel =
    cancels.find((c) => c.type === 'Principal')?.number.replace(/\s/g, '') ||
    cancels[0].number.replace(/\s/g, '');

  const [selectedContact, setSelectedContact] = useState<string>(principalCancel);

  const parseTransactionDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const filteredData = dataTableTransactions.filter((row) => {
    const dateCell = row.cells[3];
    const rowDate = parseTransactionDate(dateCell.content as string);

    const matchDate =
      (!dateRange.start || rowDate >= dateRange.start) &&
      (!dateRange.end || rowDate <= dateRange.end);

    const matchStatus = status === 'Todas' || row.cells[5].value === status;

    const rowContactNormalized = row.contact.replace(/\s/g, '');
    const selectedContactNormalized = selectedContact.replace(/\s/g, '');

    const matchContact = !selectedContact || rowContactNormalized === selectedContactNormalized;

    return matchDate && matchStatus && matchContact;
  });

  return (
    <div className="flex h-full min-h-0 flex-col py-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-[0.625rem]">
          <p className="uppercase font-semibold text-xs text-gray-800">Contacto</p>
          <ButtonDropdown
            button={selectedContact ?? 'Contacto'}
            content={
              <ul className="flex flex-col">
                {cancels.map((cancel) => (
                  <li
                    key={cancel.number}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => setSelectedContact(cancel.number)}
                  >
                    {cancel.number}
                  </li>
                ))}
              </ul>
            }
          />
        </div>

        <div className="flex flex-col gap-[0.625rem]">
          <p className="uppercase font-semibold text-xs text-gray-800">Data</p>
          <DatePicker
            onChange={(range: { startDate: Date | null; endDate: Date | null }) =>
              setDateRange({ start: range.startDate, end: range.endDate })
            }
          />
        </div>

        <div className="flex flex-col gap-[0.625rem]">
          <p className="uppercase font-semibold text-xs text-gray-800">Tipo de Operação</p>
          <ButtonDropdown
            button={status ?? 'Tipo Operação'}
            content={
              <ul className="flex flex-col">
                <li
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setStatus('Todas')}
                >
                  Todas
                </li>
                <li
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setStatus('Processado')}
                >
                  Processado
                </li>
                <li
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setStatus('Erro')}
                >
                  Erro
                </li>
              </ul>
            }
          />
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <Table headers={headersTableTransactions} data={filteredData} />
      </div>
    </div>
  );
};

const transactionHistory: CardTabItem[] = [
  {
    value: 'transactionHistory',
    label: 'Histórico de Transacções',
    content: <TransactionHistorySection />
  }
];

const CancelsBlocked: React.FC = () => {
  const user = {
    customerName: useUserStore((u) => u.getCustomerName()),
    cif: useUserStore((u) => u.getCif()),
    accountNumber: useUserStore((u) => u.getAccountNumber())
  };

  const textArea = useTextArea({
    required: true,
    maxLength: 200,
    initialValue: ''
  });

  const handleSubmit = () => {
    const isValid = textArea.validate();

    if (isValid) {
      console.log('Form submitted successfully!');
      console.log('Text content:', textArea.value);
    } else {
      console.log('Form validation failed:', textArea.error);
    }
  };

  return (
    <div className="grid h-full min-h-0 grid-cols-2 gap-4 overflow-hidden">
      <Helmet>
        <title>Cancelamento/Bloqueio</title>
      </Helmet>

      <div className="flex min-h-0 flex-col overflow-hidden">
        <PageHeader
          type="channelAndService"
          channelCategory="Canais Digitais"
          serviceTitle="Smart IZI - Cancelamento/Bloqueio"
          user={user}
        />

        <div className="mt-3 flex flex-1 min-h-0 flex-col rounded-[1.25rem] bg-white overflow-hidden">
          <div className="overflow-y-auto px-9 py-6">
            <div className="flex flex-col gap-6">
              <div className="min-h-[150px]">
                <Table headers={headersTablePrimary} data={dataTablePrimary} />
              </div>

              <div className="min-h-[200px]">
                <CardTabs
                  className="flex h-full min-h-0 flex-col"
                  cardContentClassName="h-full min-h-0 p-0"
                  tabsContentClassName="h-full min-h-0"
                  tabs={transactionHistory}
                  enableScrollY
                  enableScrollX
                />
              </div>
            </div>

            <div className="pt-6">
              <TextArea
                title="Registo"
                placeholder="Motivo da Chamada"
                {...textArea.textAreaProps}
              />
              <Button className="mt-[2.6875rem] ml-auto block" onClick={handleSubmit}>
                Fechar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ScriptDetail title="Script" />
    </div>
  );
};

export default CancelsBlocked;
