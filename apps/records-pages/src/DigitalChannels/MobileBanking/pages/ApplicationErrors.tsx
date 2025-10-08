import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router';
import {
  Button,
  ButtonDropdown,
  DatePicker,
  PageHeader,
  ScriptDetail,
  TextArea,
  useTextAreaWithDocuments
} from 'shared/components';
import { useUserStore } from 'shared/stores';
import type { CancelsBlockedInterface } from 'src/api/CancelsBlocked/interfaces';
import { GET } from 'src/api/CancelsBlocked/route';
import { TransactionsTable } from 'src/DigitalChannels/MobileBanking/components/cancelsBlocked/TransactionsTable';
import { useTableData } from '../hooks/useTableData';
import { mockPrimaryRows } from '../mocks/mockPrimaryRows';
import { mockTransactionRows } from '../mocks/mockTransactionRows';

export const APPLICATION_ERRORS_QUERY_KEY = 'application-errors';
const TITLE = 'Smart IZI - Erros de Aplicação';

async function fetchApplicationErrors(): Promise<CancelsBlockedInterface> {
  return await GET();
}

function useApplicationErrors() {
  return useQuery({
    queryKey: [APPLICATION_ERRORS_QUERY_KEY],
    queryFn: fetchApplicationErrors,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3
  });
}

export default function ApplicationErrors() {
  const [primaryRows] = useState(mockPrimaryRows);
  const navigate = useNavigate();

  const { data, isLoading } = useApplicationErrors();

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

  const textAreaWithDocs = useTextAreaWithDocuments({
    required: true,
    maxLength: 2000,
    initialValue: '',
    enableDocuments: true
  });

  const handleSubmit = () => {
    const isValid = textAreaWithDocs.validateAll();

    if (isValid) {
      console.log('Form submitted successfully!');
      console.log('Text content:', textAreaWithDocs.value);
      console.log('Uploaded files:', textAreaWithDocs.files);

      navigate('/vision-360');
    } else {
      console.log('Form validation failed:', textAreaWithDocs.error);
    }
  };

  if (!data && !isLoading) {
    return (
      <div className="mt-3 rounded-[1.25rem] bg-white py-6 px-9">
        <span className="text-gray-500">Dados não disponíveis</span>
      </div>
    );
  }

  return (
    <div className="grid h-full min-h-0 grid-cols-2 gap-4 overflow-hidden w-full">
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>

      <div className="flex min-h-0 flex-col overflow-hidden">
        <PageHeader
          type="channelAndService"
          channelCategory="Canais Digitais"
          serviceTitle={TITLE}
          user={user}
        />

        <div className="mt-3 flex flex-1 min-h-0 flex-col rounded-[1.25rem] bg-white overflow-hidden">
          <div className="overflow-y-auto px-9 py-6 flex flex-col h-full justify-between">
            <div className="flex flex-col gap-6">
              <div className="min-h-[200px]">
                <div className="mt-6 flex flex-col">
                  <div className="flex justify-between gap-7">
                    {cancels.length > 1 ? (
                      <div className="flex flex-col gap-[0.625rem]">
                        <p className="uppercase font-semibold text-xs text-gray-800">
                          N. de Telefone
                        </p>
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
                      <p className="uppercase font-semibold text-xs text-gray-800">
                        Tipo de Operação
                      </p>
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
              </div>
            </div>

            <div className="pt-6">
              <TextArea
                title="Registo"
                placeholder="Motivo da Chamada"
                enableDocuments={textAreaWithDocs.enableDocuments}
                dropzoneProps={textAreaWithDocs.dropzoneProps}
                files={textAreaWithDocs.files}
                dragActive={textAreaWithDocs.dragActive}
                errors={textAreaWithDocs.errors}
                {...textAreaWithDocs.textAreaProps}
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
}
