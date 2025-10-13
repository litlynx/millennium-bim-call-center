import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router';
import {
  Button,
  ButtonDropdown,
  DatePicker,
  PageHeader,
  ScriptDetail,
  ScrollArea,
  TextArea,
  useTextAreaWithDocuments
} from 'shared/components';
import { useUserStore } from 'shared/stores';
import type { RefillsInterface } from 'src/api/Refills/interfaces';
import { GET } from 'src/api/Refills/route';
import SuccessModal from 'src/DigitalChannels/MobileBanking/components/refills/SuccessModal';
import { CredelecTable } from '../components/refills/CredelecTable';
import { RechargesTable } from '../components/refills/RefillsTable';
import { TvPacketsTable } from '../components/refills/TvPacketsTable';
import { useCredelecTableData } from '../hooks/useCredelecTableData';
import { useRefillsTableData } from '../hooks/useRefillsTableData';
import { useTvPacketsTableData } from '../hooks/useTvPacketsTableData';

export const REFILLS_QUERY_KEY = 'refills';
const TITLE = 'Smart IZI - Recargas';

async function fetchRefills(): Promise<RefillsInterface> {
  return await GET();
}

function useRefills() {
  return useQuery({
    queryKey: [REFILLS_QUERY_KEY],
    queryFn: fetchRefills,
    staleTime: 5 * 60 * 1000,
    retry: 3
  });
}

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

type TableType = 'refills' | 'credelec' | 'tvpackets';

const Refills: React.FC = () => {
  const navigate = useNavigate();
  const [activeTable, setActiveTable] = React.useState<TableType>('refills');
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const { data, isLoading } = useRefills();
  const isRefillsTableError = data?.refillsTable && 'error' in data.refillsTable;
  const isCredelecTableError = data?.credelecTable && 'error' in data.credelecTable;
  const isTvPacketsTableError = data?.tvPacketsTable && 'error' in data.tvPacketsTable;

  const renderFilters = () => {
    switch (activeTable) {
      case 'refills':
        return (
          <div className="flex justify-start gap-7" data-testid="recharge-filters-refills">
            <div className="flex flex-col gap-[0.625rem]">
              <p className="uppercase font-semibold text-xs text-gray-800">Operadora</p>
              <ButtonDropdown
                width="medium"
                button={rechargesOperator}
                content={
                  <ul className="flex flex-col">
                    <li
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => setRechargesOperator('Todas operadoras')}
                    >
                      Todas operadoras
                    </li>
                    {rechargesOperators.map((op) => (
                      <li
                        key={op}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => setRechargesOperator(op)}
                      >
                        {op}
                      </li>
                    ))}
                  </ul>
                }
              />
            </div>

            <div className="flex flex-col gap-[0.625rem]">
              <p className="uppercase font-semibold text-xs text-gray-800">Telemóvel do mobile</p>
              <ButtonDropdown
                width="medium"
                button={rechargesPhone}
                content={
                  <ul className="flex flex-col">
                    <li
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => setRechargesPhone('Todos telemóveis')}
                    >
                      Todos telemóveis
                    </li>
                    {rechargesPhones.map((phone) => (
                      <li
                        key={phone}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => setRechargesPhone(phone)}
                      >
                        {phone}
                      </li>
                    ))}
                  </ul>
                }
              />
            </div>

            <div className="flex flex-col gap-[0.625rem]">
              <p className="uppercase font-semibold text-xs text-gray-800">Número de Destino</p>
              <div className="relative">
                <input
                  value={destinationNumber}
                  onChange={(e) => setDestinationNumber(e.target.value)}
                  placeholder="Digite o número"
                  className="w-[155px] justify-between font-medium text-xs rounded-2xl border border-gray-450 text-gray-450 px-3 py-1 h-fit bg-white"
                />
              </div>
            </div>

            <div className="flex flex-col gap-[0.625rem]">
              <p className="uppercase font-semibold text-xs text-gray-800">Data</p>
              <DatePicker
                defaultPreset="last7Days"
                onChange={(range: { startDate: Date | null; endDate: Date | null }) =>
                  setRechargesDateRange({ start: range.startDate, end: range.endDate })
                }
              />
            </div>
          </div>
        );
      case 'credelec':
        return (
          <div className="flex justify-start gap-7" data-testid="credelec-filters-refills">
            <div className="flex flex-col gap-[0.625rem]">
              <p className="uppercase font-semibold text-xs text-gray-800">Telemóvel do mobile</p>
              <ButtonDropdown
                width="medium"
                button={credelecPhone}
                content={
                  <ul className="flex flex-col">
                    <li
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => setCredelecPhone('Todos telemóveis')}
                    >
                      Todos telemóveis
                    </li>
                    {credelecPhones.map((phone) => (
                      <li
                        key={phone}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => setCredelecPhone(phone)}
                      >
                        {phone}
                      </li>
                    ))}
                  </ul>
                }
              />
            </div>

            <div className="flex flex-col gap-[0.625rem]">
              <p className="uppercase font-semibold text-xs text-gray-800">Data</p>
              <DatePicker
                defaultPreset="last7Days"
                onChange={(range: { startDate: Date | null; endDate: Date | null }) =>
                  setCredelecDateRange({ start: range.startDate, end: range.endDate })
                }
              />
            </div>
          </div>
        );
      case 'tvpackets':
        return (
          <div className="flex justify-start gap-7" data-testid="tv-filters-refills">
            <div className="flex flex-col gap-[0.625rem]">
              <p className="uppercase font-semibold text-xs text-gray-800">Operadora</p>
              <ButtonDropdown
                width="medium"
                button={tvOperator}
                content={
                  <ul className="flex flex-col">
                    <li
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => setTvOperator('Todas operadoras')}
                    >
                      Todas operadoras
                    </li>
                    {tvOperators.map((op) => (
                      <li
                        key={op}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => setTvOperator(op)}
                      >
                        {op}
                      </li>
                    ))}
                  </ul>
                }
              />
            </div>

            <div className="flex flex-col gap-[0.625rem]">
              <p className="uppercase font-semibold text-xs text-gray-800">Telemóvel do mobile</p>
              <ButtonDropdown
                width="medium"
                button={tvPhone}
                content={
                  <ul className="flex flex-col">
                    <li
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => setTvPhone('Todos telemóveis')}
                    >
                      Todos telemóveis
                    </li>
                    {tvPhones.map((phone) => (
                      <li
                        key={phone}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => setTvPhone(phone)}
                      >
                        {phone}
                      </li>
                    ))}
                  </ul>
                }
              />
            </div>

            <div className="flex flex-col gap-[0.625rem]">
              <p className="uppercase font-semibold text-xs text-gray-800">Data</p>
              <DatePicker
                defaultPreset="last7Days"
                onChange={(range: { startDate: Date | null; endDate: Date | null }) =>
                  setTvDateRange({ start: range.startDate, end: range.endDate })
                }
              />
            </div>
          </div>
        );
    }
  };

  const renderTable = () => {
    switch (activeTable) {
      case 'refills':
        if (isRefillsTableError) {
          return (
            <div className="py-2 text-current text-gray-500">
              Erro ao carregar tabela de recargas
            </div>
          );
        }
        return <RechargesTable data={filteredRechargesRows} />;

      case 'credelec':
        if (isCredelecTableError) {
          return (
            <div className="py-2 text-current text-gray-500">Erro ao carregar tabela credelec</div>
          );
        }
        return <CredelecTable data={filteredCredelecRows} />;

      case 'tvpackets':
        if (isTvPacketsTableError) {
          return (
            <div className="py-2 text-current text-gray-500">
              Erro ao carregar tabela pacotes TV
            </div>
          );
        }
        return <TvPacketsTable data={filteredTvPacketsRows} />;
    }
  };

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

  const {
    filteredRechargesRows,
    availableOperators: rechargesOperators,
    availableContacts: rechargesPhones,
    setDateRange: setRechargesDateRange,
    operator: rechargesOperator,
    setOperator: setRechargesOperator,
    selectedPhone: rechargesPhone,
    setSelectedPhone: setRechargesPhone,
    destinationNumber,
    setDestinationNumber
  } = useRefillsTableData({
    rechargesRows: !data?.refillsTable || isRefillsTableError ? [] : data.refillsTable
  });

  const {
    filteredCredelecRows,
    availableContacts: credelecPhones,
    setDateRange: setCredelecDateRange,
    selectedPhone: credelecPhone,
    setSelectedPhone: setCredelecPhone
  } = useCredelecTableData({
    credelecRows: !data?.credelecTable || isCredelecTableError ? [] : data.credelecTable
  });

  const {
    filteredTvPacketsRows,
    availableOperators: tvOperators,
    availableContacts: tvPhones,
    setDateRange: setTvDateRange,
    operator: tvOperator,
    setOperator: setTvOperator,
    selectedPhone: tvPhone,
    setSelectedPhone: setTvPhone
  } = useTvPacketsTableData({
    tvPacketsRows: !data?.tvPacketsTable || isTvPacketsTableError ? [] : data.tvPacketsTable
  });

  const handleSendEmail = () => {
    if (textAreaWithDocs.value.trim() === '') {
      console.log('Cannot send email: Text area is empty.');
      return;
    }
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
      navigate('/vision-360');
    }, 2000);

    console.log('Sending email to ngsm@millenniumbim.co.mz', textAreaWithDocs.value);
  };

  const handleSubmit = () => {
    const isValid = textAreaWithDocs.validate();

    if (isValid) {
      console.log('Form submitted successfully!');
      console.log('Text content:', textAreaWithDocs.value);

      navigate('/vision-360');
    } else {
      console.log('Form validation failed:', textAreaWithDocs.error);
    }
  };

  return (
    <>
      <div className="grid h-full min-h-0 grid-cols-2 gap-4 overflow-hidden w-full">
        <Helmet>
          <title>Recargas</title>
        </Helmet>

        <div className="flex min-h-0 flex-col overflow-hidden">
          <PageHeader
            type="channelAndService"
            channelCategory="Canais Digitais"
            serviceTitle={TITLE}
            user={user}
          />

          <div className="mt-3 flex flex-1 min-h-0 flex-col rounded-[1.25rem] bg-white overflow-hidden">
            <div className="overflow-y-auto px-9 py-6 flex flex-col justify-between h-full">
              <div className="flex flex-col gap-10">
                <div className="flex gap-4">
                  <Button
                    variant="mono"
                    className={
                      activeTable === 'refills' ? 'bg-gray-700 text-white hover:bg-gray-700' : ''
                    }
                    onClick={() => setActiveTable('refills')}
                    aria-pressed={activeTable === 'refills'}
                  >
                    Recargas
                  </Button>
                  <Button
                    variant="mono"
                    className={
                      activeTable === 'credelec' ? 'bg-gray-700 text-white hover:bg-gray-700' : ''
                    }
                    onClick={() => setActiveTable('credelec')}
                    aria-pressed={activeTable === 'credelec'}
                  >
                    Credelec
                  </Button>
                  <Button
                    variant="mono"
                    className={
                      activeTable === 'tvpackets' ? 'bg-gray-700 text-white hover:bg-gray-700' : ''
                    }
                    onClick={() => setActiveTable('tvpackets')}
                    aria-pressed={activeTable === 'tvpackets'}
                  >
                    Pacotes de TV
                  </Button>
                </div>

                <div className="min-h-[200px]">
                  <ScrollArea className="h-full">
                    {renderFilters()}
                    {renderTable()}
                    {isLoading && (
                      <div className="py-2 text-current text-gray-500">A carregar dados...</div>
                    )}
                    {!data?.refillsTable &&
                      !data?.credelecTable &&
                      !data?.tvPacketsTable &&
                      !isLoading && (
                        <div className="mt-3 rounded-[1.25rem] bg-white py-6 px-9">
                          <div className="text-gray-500">Dados não disponíveis</div>
                        </div>
                      )}
                  </ScrollArea>
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

                <div className="mt-[2.6875rem] flex justify-end gap-3">
                  <Button variant="outline" onClick={handleSendEmail}>
                    Encaminhar
                  </Button>
                  <Button onClick={handleSubmit}>Fechar</Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ScriptDetail title="Script" />
      </div>
      <SuccessModal
        isOpen={showSuccessModal}
        onOpenChange={(open) => {
          if (!open) setShowSuccessModal(false);
        }}
        message={'Encaminhado com sucesso'}
      />
    </>
  );
};

export default Refills;
