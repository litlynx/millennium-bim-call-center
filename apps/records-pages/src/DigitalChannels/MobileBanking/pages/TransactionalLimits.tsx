import type React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router';
import { Button, PageHeader, ScriptDetail, Table, TextArea, useTextArea } from 'shared/components';
import { useUserStore } from 'shared/stores';
import { StateBadge } from 'src/DigitalChannels/MobileBanking/components/cancelsBlocked/StateBadge';

export const CANCELS_BLOCKED_QUERY_KEY = 'transactional-limits';
const TITLE = 'Smart IZI - Limites Transaccionais';

export interface OperatorStateMock {
  operator: string;
  contractState: string;
  pin2State: string;
}

export const operatorStateMocks: OperatorStateMock[] = [
  {
    operator: 'TMcel',
    contractState: 'Activo',
    pin2State: 'Activo'
  }
];

const headersTableTwo = [
  { key: 'phoneNumber', label: 'Número de celular' },
  { key: 'transfersLimit', label: 'Limite de Transferências' },
  { key: 'rechargeLimit', label: 'Limite de recargas' }
];

const dataTableTwo = [
  {
    id: 'row-1',
    cells: [
      { key: 'phoneNumber', content: '+258 878 640 120' },
      { key: 'transfersLimit', content: 'MT 5,000.00' },
      { key: 'rechargeLimit', content: 'MT 2,000.00' }
    ]
  }
];

const TransactionalLimits: React.FC = () => {
  const navigate = useNavigate();

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

      navigate('/vision-360');
    } else {
      console.log('Form validation failed:', textArea.error);
    }
  };

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
              {operatorStateMocks.map(({ operator, contractState, pin2State }) => (
                <div key={operator} className="flex gap-4 overflow-auto pb-2">
                  <div className="flex flex-col gap-2 min-w-[150px]">
                    <p className="text-gray-800 uppercase font-semibold text-xs">Operadora</p>
                    <span className="text-xs font-medium text-gray-600">{operator}</span>
                  </div>

                  <div className="flex flex-col gap-2 min-w-[210px]">
                    <p className="text-gray-800 uppercase font-semibold text-xs">
                      Estado do Contracto
                    </p>
                    <StateBadge state={contractState} />
                  </div>

                  <div className="flex flex-col gap-2 min-w-[210px]">
                    <p className="text-gray-800 uppercase font-semibold text-xs">Estado do PIN2</p>
                    <StateBadge state={pin2State} />
                  </div>
                </div>
              ))}

              <Table headers={headersTableTwo} data={dataTableTwo} />
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
