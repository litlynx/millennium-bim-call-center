import { useQuery } from '@tanstack/react-query';
import type React from 'react';
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
import type { CancelsBlockedInterface } from 'src/api/CancelsBlocked/interfaces';
import { GET } from 'src/api/CancelsBlocked/route';
import ConfirmModal from 'src/DigitalChannels/MobileBanking/components/cancelsBlocked/ConfirmModal';
import FraudModal from 'src/DigitalChannels/MobileBanking/components/cancelsBlocked/FraudModal';
import SuccessModal from 'src/DigitalChannels/MobileBanking/components/cancelsBlocked/SuccessModal';
import { PrimaryTable } from '../components/cancelsBlocked/PrimaryTable';
import { TransactionsTable } from '../components/cancelsBlocked/TransactionsTable';
import { useTableData } from '../hooks/useTableData';
import { mockPrimaryRows } from '../mocks/mockPrimaryRows';
import { mockTransactionRows } from '../mocks/mockTransactionRows';

export const CANCELS_BLOCKED_QUERY_KEY = 'cancels-blocked';

async function fetchCancelsBlocked(): Promise<CancelsBlockedInterface> {
  return await GET();
}

function useCancelsBlocked() {
  return useQuery({
    queryKey: [CANCELS_BLOCKED_QUERY_KEY],
    queryFn: fetchCancelsBlocked,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3
  });
}

const CancelsBlocked: React.FC = () => {
  const [showFraudModal, setShowFraudModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastActionType, setLastActionType] = useState<'block' | 'delete' | null>(null);
  const [primaryRows, setPrimaryRows] = useState(mockPrimaryRows);

  const { data, isLoading } = useCancelsBlocked();

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
    filteredTransactionRows,
    availableTransactionTypes
  } = useTableData({
    primaryRows: primaryRows,
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
        <div className="mt-6 flex flex-col">
          <div className="flex justify-between gap-7">
            {cancels.length > 1 ? (
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
            ) : (
              ''
            )}
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
                    {availableTransactionTypes.map((type) => (
                      <li
                        key={type}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => setStatus(type)}
                      >
                        {type}
                      </li>
                    ))}
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

  if (!data && !isLoading) {
    return (
      <div className="mt-3 rounded-[1.25rem] bg-white py-6 px-9">
        <span className="text-gray-500">Dados não disponíveis</span>
      </div>
    );
  }

  return (
    <>
      <div className="grid h-full min-h-0 grid-cols-2 gap-4 overflow-hidden w-full">
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
                <div className="min-h-[100px]">
                  <PrimaryTable data={primaryRows} onBlock={handleBlock} onDelete={handleDelete} />
                </div>

                <div className="min-h-[200px]">
                  <CardTabs
                    className="h-full"
                    tabs={transactionHistory}
                    cardContentClassName="p-0"
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
    </>
  );
};

export default CancelsBlocked;
