import { useQuery } from '@tanstack/react-query';
import type React from 'react';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button, PageHeader, ScriptDetail, TextArea, useTextArea } from 'shared/components';
import { useUserStore } from 'shared/stores';
import type { AccessesInterface } from 'src/api/Accesses/interfaces';
import { GET } from 'src/api/Accesses/route';
import { PrimaryTable } from '../components/cancelsBlocked/PrimaryTable';
import { mockPrimaryRows } from '../mocks/mockPrimaryRows';

export const ACCESSES_QUERY_KEY = 'accesses';

async function fetchAccesses(): Promise<AccessesInterface> {
  return await GET();
}

function useAccesses() {
  return useQuery({
    queryKey: [ACCESSES_QUERY_KEY],
    queryFn: fetchAccesses,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3
  });
}

const Accesses: React.FC = () => {
  const { data, isLoading } = useAccesses();
  const [primaryRows] = useState(mockPrimaryRows);

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
        <title>Acessos</title>
      </Helmet>

      <div className="flex min-h-0 flex-col overflow-hidden">
        <PageHeader
          type="channelAndService"
          channelCategory="Canais Digitais"
          serviceTitle="Smart IZI - Acessos"
          user={user}
        />

        <div className="mt-3 flex flex-1 min-h-0 flex-col rounded-[1.25rem] bg-white overflow-hidden">
          <div className="overflow-y-auto px-9 py-6 flex flex-col h-full justify-between">
            <div className="flex flex-col gap-6">
              <div className="min-h-[100px]">
                <PrimaryTable data={primaryRows} />
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

export default Accesses;
