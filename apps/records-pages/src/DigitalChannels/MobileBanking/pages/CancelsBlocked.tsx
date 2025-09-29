
import type React from 'react';
import { useQuery } from '@tanstack/react-query';
import type * as React from 'react';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  Button,
  ButtonDropdown,
  type CardTabItem,
  CardTabs,
  DatePicker,
  PageHeader,
  ScriptDetail,
  TextArea,
  useTextArea
} from 'shared/components';
import { useUserStore } from 'shared/stores';
import ConfirmModal from '../components/cancelsBlocked/ConfirmModal';
import FraudModal from '../components/cancelsBlocked/FraudModal';
import { PrimaryTable } from '../components/cancelsBlocked/PrimaryTable';
import SuccessModal from '../components/cancelsBlocked/SuccessModal';
import { TransactionsTable } from '../components/cancelsBlocked/TransactionsTable';
import { useTableData } from '../hooks/useTableData';
import { mockPrimaryRows } from '../mocks/mockPrimaryRows';
import { mockTransactionRows } from '../mocks/mockTransactionRows';
import type { CancelsBlockedInterface } from 'src/api/CancelsBlocked/interfaces';
import { GET } from 'src/api/CancelsBlocked/route';

const CancelsBlocked: React.FC = () => {
  const [showFraudModal, setShowFraudModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastActionType, setLastActionType] = useState<'block' | 'delete' | null>(null);
  const [primaryRows, setPrimaryRows] = useState(mockPrimaryRows);

  const handleConfirm = () => {
    if (modalType === 'block' && selectedRowId) {
      setPrimaryRows((rows) =>
        rows.map((row) =>
          row.id === selectedRowId
            ? {
                ...row,
                badgeText: 'Inativo'
              }
            : row
        )
      );
      setModalOpen(false);
      setLastActionType('block');
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 2000);
      setSelectedRowId(null);
      setModalType(null);
    } else if (modalType === 'delete' && selectedRowId) {
      setModalOpen(false);
      setShowFraudModal(true);
    }
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
            <Icon type="eye" className="p-0 cursor-pointer" />
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
            <Icon type="eye" className="p-0 cursor-pointer" />
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
            <Icon type="eye" className="p-0 cursor-pointer" />
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

export const ESTATE_AND_PRODUCTS_QUERY_KEY = 'cancels-blocked';

async function fetchCancelsBlocked(): Promise<CancelsBlockedInterface> {
  return await GET();
}

function useCancelsBlocked() {
  return useQuery({
    queryKey: ['CANCELS_BLOCKED_QUERY_KEY'],
    queryFn: fetchCancelsBlocked,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3
  });
}

const TransactionHistorySection: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    start: null,
    end: null
  });
  const [status, setStatus] = useState<string>('Todas');

  const { data } = useCancelsBlocked();

  console.log(data);

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

  const handleFraud = () => {
    try {
      setShowFraudModal(false);
      setLastActionType('delete');
      setShowSuccessModal(true);
      setPrimaryRows((rows) => rows.filter((row) => row.id !== selectedRowId));
      setTimeout(() => setShowSuccessModal(false), 2000);
      setSelectedRowId(null);
      setModalType(null);
    } catch (error) {
      console.error('Error handling fraud:', error);
      //TODO lidar com erro
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
    setSelectedRowId(null);
    setModalType(null);
  };
  const {
    cancels,
    selectedContact,
    setSelectedContact,
    setDateRange,
    status,
    setStatus,
    filteredTransactionRows
  } = useTableData({
    primaryRows: mockPrimaryRows,
    transactionRows: mockTransactionRows
  });

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

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'block' | 'delete' | null>(null);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const handleBlock = (id: string) => {
    setSelectedRowId(id);
    setModalType('block');
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setSelectedRowId(id);
    setModalType('delete');
    setModalOpen(true);
  };

  const transactionHistory: CardTabItem[] = [
    {
      value: 'transactionHistory',
      label: 'Histórico de Transacções',
      content: (
        <div className="mt-6 flex flex-col gap-7">
          <div className="flex justify-between">
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
          <TransactionsTable data={filteredTransactionRows} />
        </div>
      )
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      <Helmet>
        <title>Cancelamento/Bloqueio</title>
      </Helmet>

      <div>
        <PageHeader
          type="channelAndService"
          channelCategory="Canais Digitais"
          serviceTitle="Smart IZI - Cancelamento/Bloqueio"
          user={user}
        />

        <div className="mt-3 rounded-[1.25rem] bg-white py-6 px-9">
          <PrimaryTable data={primaryRows} onBlock={handleBlock} onDelete={handleDelete} />

          <CardTabs className="h-full" tabs={transactionHistory} />
        </div>

        <div className="bg-white rounded-[20px] mt-9">
          <TextArea title="Registo" placeholder="Motivo da Chamada" {...textArea.textAreaProps} />
          <Button className="mt-[2.6875rem] ml-auto block" onClick={handleSubmit}>
            Fechar
          </Button>
        </div>
        <ConfirmModal
          isOpen={modalOpen}
          onOpenChange={(open) => {
            if (!open) handleCancel();
          }}
          title={modalType === 'block' ? 'Bloqueio Mobile Banking' : 'Cancelamento Mobile Banking'}
          description={`Pretende mesmo ${modalType === 'block' ? 'bloquear' : 'eliminar'} o contracto mobile?`}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
        <FraudModal
          isOpen={showFraudModal}
          onOpenChange={(open) => {
            if (!open) setShowFraudModal(false);
          }}
          onChoice={handleFraud}
        />
        <SuccessModal
          isOpen={showSuccessModal}
          onOpenChange={(open) => {
            if (!open) setShowSuccessModal(false);
          }}
          message={
            lastActionType === 'block'
              ? 'Contracto bloqueado com sucesso'
              : 'Contracto cancelado com sucesso'
          }
        />
      </div>

      <ScriptDetail title="Script" />
    </div>
  );
};

export default CancelsBlocked;
