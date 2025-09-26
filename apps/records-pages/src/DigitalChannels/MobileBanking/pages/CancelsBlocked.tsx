import type React from 'react';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  Button,
  ButtonDropdown,
  DatePicker,
  Icon,
  Modal,
  PageHeader,
  ScriptDetail,
  TextArea,
  useTextArea
} from 'shared/components';
import { useUserStore } from 'shared/stores';
import { PrimaryTable } from '../components/cancelsBlocked/PrimaryTable';
import { TransactionsTable } from '../components/cancelsBlocked/TransactionsTable';
import { useTableData } from '../hooks/useTableData';
import { mockPrimaryRows } from '../mocks/mockPrimaryRows';
import { mockTransactionRows } from '../mocks/mockTransactionRows';

const CancelsBlocked: React.FC = () => {
  const [primaryRows, setPrimaryRows] = useState(mockPrimaryRows);

  const handleConfirm = () => {
    if (modalType === 'block' && selectedRowId) {
      setPrimaryRows((rows) =>
        rows.map((row) =>
          row.id === selectedRowId
            ? {
                ...row,
                badgeText: 'Bloqueado'
              }
            : row
        )
      );
    }
    if (modalType === 'delete' && selectedRowId) {
      setPrimaryRows((rows) => rows.filter((row) => row.id !== selectedRowId));
    }
    setModalOpen(false);
    setSelectedRowId(null);
    setModalType(null);
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
        </div>

        <div className="bg-white rounded-[20px] mt-9">
          <TextArea title="Registo" placeholder="Motivo da Chamada" {...textArea.textAreaProps} />
          <Button className="mt-[2.6875rem] ml-auto block" onClick={handleSubmit}>
            Fechar
          </Button>
        </div>

        <Modal
          isOpen={modalOpen}
          onOpenChange={(open) => {
            if (!open) handleCancel();
          }}
          title={modalType === 'block' ? 'Bloqueio Mobile Banking' : 'Cancelamento Mobile Banking'}
          description={`Pretende mesmo ${modalType === 'block' ? 'bloquear' : 'eliminar'} o contacto mobile?`}
          icon={
            <Icon type="danger" className="bg-primary p-2 font-bold h-[57px] w-[57px]" size="lg" />
          }
          footer={
            <div className="flex justify-end gap-3">
              <Button variant="light" onClick={handleCancel} className="">
                Cancelar
              </Button>
              <Button variant="solid" onClick={handleConfirm}>
                Confirmar
              </Button>
            </div>
          }
          size="sm"
          className="bg-white"
        >
          {null}
        </Modal>
      </div>

      <ScriptDetail title="Script" />
    </div>
  );
};

export default CancelsBlocked;
