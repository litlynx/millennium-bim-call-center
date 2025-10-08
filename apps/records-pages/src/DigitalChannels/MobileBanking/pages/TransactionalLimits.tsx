import { useQuery } from '@tanstack/react-query';
import type React from 'react';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router';
import { Button, PageHeader, ScriptDetail, Table, TextArea, useTextArea } from 'shared/components';
import type { TableRowData } from 'shared/components/Table/Table';
import { useUserStore } from 'shared/stores';
import type {
  OperatorStatusTransactionalLimitType,
  TransactionalLimitInterface
} from 'src/api/TransactionalLimit/interfaces';
import { GET } from 'src/api/TransactionalLimit/route';
import { StateBadge } from 'src/DigitalChannels/MobileBanking/components/cancelsBlocked/StateBadge';

export const TRANSACTIONAL_LIMITS_QUERY_KEY = 'transactional-limits';
const TITLE = 'Smart IZI - Limites Transaccionais';

async function fetchTransactionalLimits(): Promise<TransactionalLimitInterface> {
  return await GET();
}

function useTransactionalLimits() {
  return useQuery({
    queryKey: [TRANSACTIONAL_LIMITS_QUERY_KEY],
    queryFn: fetchTransactionalLimits,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3
  });
}

const TransactionalLimits: React.FC = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useTransactionalLimits();

  const isOperatorStateDataError = data?.operatorStateData && 'error' in data.operatorStateData;
  const isTransactionalLimitsDataError =
    data?.transactionalLimitsData && 'error' in data.transactionalLimitsData;

  const user = {
    customerName: useUserStore((u) => u.getCustomerName()),
    cif: useUserStore((u) => u.getCif()),
    accountNumber: useUserStore((u) => u.getAccountNumber())
  };

  const textArea = useTextArea({
    required: true,
    maxLength: 2000,
    initialValue: ''
  });

  const handleSubmit = () => {
    const isValid = textArea.validate();

    if (isValid) {
      console.log('Form submitted successfully!');
      console.log('Text content:', textArea.value);

      navigate('/vision-360');
    } else {
      console.log('Form validation failed:', textArea.error);
    }
  };

  const formatTransactionalLimitsData = () => {
    if (!data?.transactionalLimitsData || isTransactionalLimitsDataError) return [];

    return data.transactionalLimitsData.map((item) => ({
      id: item.id,
      cells: [
        { content: item.phoneNumber },
        { content: item.transfersLimit },
        { content: item.rechargesLimit }
      ]
    }));
  };

  const [formatedTransationalLimitsData, setFormatedTransationalLimitsData] = useState<
    TableRowData[]
  >([]);

  useEffect(() => {
    const data = formatTransactionalLimitsData();
    setFormatedTransationalLimitsData(data);
  }, [data?.transactionalLimitsData]);

  const transactionalLimitsHeaders = [
    { key: 'phoneNumber', label: 'Telefone', id: 'phoneNumber' },
    { key: 'transfersLimit', label: 'Limite de Transferências', id: 'transfersLimit' },
    { key: 'rechargesLimit', label: 'Limite de Recargas', id: 'rechargesLimit' }
  ];

  if (!data?.operatorStateData && data?.transactionalLimitsData && !isLoading) {
    return (
      <div className="mt-3 rounded-[1.25rem] bg-white py-6 px-9">
        <span className="text-gray-500">Dados não disponíveis</span>
      </div>
    );
  }

  return (
    <div className="grid h-full min-h-0 grid-cols-2 gap-4 overflow-hidden w-full">
      <Helmet>
        <title>Limites Transaccionais</title>
      </Helmet>

      <div className="flex min-h-0 flex-col overflow-hidden">
        <PageHeader
          type="channelAndService"
          channelCategory="Canais Digitais"
          serviceTitle={TITLE}
          user={user}
        />

        <div className="mt-3 flex flex-1 min-h-0 flex-col rounded-[1.25rem] bg-white overflow-hidden">
          <div className="overflow-y-auto px-9 py-6">
            <div className="flex flex-col gap-10">
              {!isOperatorStateDataError &&
                data?.operatorStateData.map((item: OperatorStatusTransactionalLimitType) => (
                  <div key={item.id} className="flex gap-4 overflow-auto pb-2">
                    <div className="flex flex-col gap-2 min-w-[150px]">
                      <p className="text-gray-800 uppercase font-semibold text-xs">Operadora</p>
                      <span className="text-xs font-medium text-gray-600">{item.operatorName}</span>
                    </div>

                    <div className="flex flex-col gap-2 min-w-[210px]">
                      <p className="text-gray-800 uppercase font-semibold text-xs">
                        Estado do Contracto
                      </p>
                      <StateBadge state={item.contractState} />
                    </div>

                    <div className="flex flex-col gap-2 min-w-[210px]">
                      <p className="text-gray-800 uppercase font-semibold text-xs">
                        Estado do PIN2
                      </p>
                      <StateBadge state={item.pin2State} />
                    </div>
                  </div>
                ))}

              {isOperatorStateDataError && (
                <div className="flex gap-4 overflow-auto pb-2">
                  <div className="flex flex-col gap-2 min-w-[150px]">
                    <p className="text-gray-800 uppercase font-semibold text-xs">Operadora</p>
                    <span className="text-xs font-medium text-gray-600">-</span>
                  </div>

                  <div className="flex flex-col gap-2 min-w-[210px]">
                    <p className="text-gray-800 uppercase font-semibold text-xs">
                      Estado do Contracto
                    </p>
                    -
                  </div>

                  <div className="flex flex-col gap-2 min-w-[210px]">
                    <p className="text-gray-800 uppercase font-semibold text-xs">Estado do PIN2</p>-
                  </div>
                </div>
              )}

              <Table data={formatedTransationalLimitsData} headers={transactionalLimitsHeaders} />

              {isLoading && <div>A carregar dados...</div>}
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

export default TransactionalLimits;
