import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router';
import {
  Button,
  ButtonDropdown,
  DatePicker,
  Input,
  PageHeader,
  ScriptDetail,
  TextArea,
  useTextArea
} from 'shared/components';
import { useUserStore } from 'shared/stores';
import { CredelecTable } from '../components/recharges/CredelecTable';
import { RechargesTable } from '../components/recharges/RechargesTable';
import { TvPacketsTable } from '../components/recharges/TvPacketsTable';
import { useCredelecTableData } from '../hooks/useCredelecTableData';
import { useRechargesTableData } from '../hooks/useRechargesTableData';
import { useTvPacketsTableData } from '../hooks/useTvPacketsTableData';
import { mockPrimaryRows as mockCredelec } from '../mocks/mockCredelec';
import { mockPrimaryRows as mockRecharges } from '../mocks/mockRecharges';
import { mockPrimaryRows as mockTvPackets } from '../mocks/mockTvPackets';

export const CANCELS_BLOCKED_QUERY_KEY = 'recharges';
const TITLE = 'Smart IZI - Recargas';

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

const Recharges: React.FC = () => {
  const navigate = useNavigate();
  const [activeTable, setActiveTable] = React.useState<'recharges' | 'credelec' | 'tvpackets'>(
    'recharges'
  );

  const renderFilters = () => {
    switch (activeTable) {
      case 'recharges':
        return (
          <div className="flex justify-between gap-7">
            {/* Filtro Operadora */}
            <div className="flex flex-col gap-[0.625rem]">
              <p className="uppercase font-semibold text-xs text-gray-800">Operadora</p>
              <ButtonDropdown
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

            {/* Filtro Telemóvel */}
            <div className="flex flex-col gap-[0.625rem]">
              <p className="uppercase font-semibold text-xs text-gray-800">Telemóvel</p>
              <ButtonDropdown
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

            {/* Filtro Número de Destino */}
            <div className="flex flex-col gap-[0.625rem]">
              <p className="uppercase font-semibold text-xs text-gray-800">Número de Destino</p>
              <Input
                value={destinationNumber}
                onChange={(e) => setDestinationNumber(e.target.value)}
                placeholder="Digite o número"
              />
            </div>

            {/* Filtro Data */}
            <div className="flex flex-col gap-[0.625rem]">
              <p className="uppercase font-semibold text-xs text-gray-800">Data</p>
              <DatePicker
                onChange={(range: { startDate: Date | null; endDate: Date | null }) =>
                  setRechargesDateRange({ start: range.startDate, end: range.endDate })
                }
              />
            </div>
          </div>
        );
      case 'credelec':
        return (
          <div className="flex justify-between gap-7">
            {/* Filtro Telemóvel */}
            <div className="flex flex-col gap-[0.625rem]">
              <p className="uppercase font-semibold text-xs text-gray-800">Telemóvel</p>
              <ButtonDropdown
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

            {/* Filtro Data */}
            <div className="flex flex-col gap-[0.625rem]">
              <p className="uppercase font-semibold text-xs text-gray-800">Data</p>
              <DatePicker
                onChange={(range: { startDate: Date | null; endDate: Date | null }) =>
                  setCredelecDateRange({ start: range.startDate, end: range.endDate })
                }
              />
            </div>
          </div>
        );
      case 'tvpackets':
        return (
          <div className="flex justify-between gap-7">
            {/* Filtro Operadora */}
            <div className="flex flex-col gap-[0.625rem]">
              <p className="uppercase font-semibold text-xs text-gray-800">Operadora</p>
              <ButtonDropdown
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

            {/* Filtro Telemóvel */}
            <div className="flex flex-col gap-[0.625rem]">
              <p className="uppercase font-semibold text-xs text-gray-800">Telemóvel</p>
              <ButtonDropdown
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

            {/* Filtro Data */}
            <div className="flex flex-col gap-[0.625rem]">
              <p className="uppercase font-semibold text-xs text-gray-800">Data</p>
              <DatePicker
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
      case 'recharges':
        return <RechargesTable data={filteredRechargesRows} />;
      case 'credelec':
        return <CredelecTable data={filteredCredelecRows} />;
      case 'tvpackets':
        return <TvPacketsTable data={filteredTvPacketsRows} />;
    }
  };

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

  const {
    filteredRechargesRows,
    availableOperators: rechargesOperators,
    availablePhones: rechargesPhones,
    setDateRange: setRechargesDateRange,
    operator: rechargesOperator,
    setOperator: setRechargesOperator,
    selectedPhone: rechargesPhone,
    setSelectedPhone: setRechargesPhone,
    destinationNumber,
    setDestinationNumber
  } = useRechargesTableData({ rechargesRows: mockRecharges });

  const {
    filteredCredelecRows,
    availablePhones: credelecPhones,
    setDateRange: setCredelecDateRange,
    selectedPhone: credelecPhone,
    setSelectedPhone: setCredelecPhone
  } = useCredelecTableData({ credelecRows: mockCredelec });

  const {
    filteredTvPacketsRows,
    availableOperators: tvOperators,
    availablePhones: tvPhones,
    setDateRange: setTvDateRange,
    operator: tvOperator,
    setOperator: setTvOperator,
    selectedPhone: tvPhone,
    setSelectedPhone: setTvPhone
  } = useTvPacketsTableData({ tvPacketsRows: mockTvPackets });

  const handleSendEmail = () => {
    if (textArea.value.trim() === '') {
      console.log('Cannot send email: Text area is empty.');
      return;
    }
    console.log('Sending email to ngsm@millenniumbim.co.mz', textArea.value);
  };

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
          <div className="overflow-y-auto px-9 py-6">
            <div className="flex flex-col gap-6">
              {/* Botões de navegação entre tabelas */}
              <div className="flex gap-4">
                <Button variant="mono" onClick={() => setActiveTable('recharges')}>
                  Recargas Móveis
                </Button>
                <Button variant="mono" onClick={() => setActiveTable('credelec')}>
                  Credelec
                </Button>
                <Button variant="mono" onClick={() => setActiveTable('tvpackets')}>
                  TV Packets
                </Button>
              </div>

              <div className="mt-6">{renderFilters()}</div>

              <div>{renderTable()}</div>
            </div>

            <div className="pt-6">
              <TextArea title="Registo" placeholder="" {...textArea.textAreaProps} />

              <Button variant="outline" onClick={handleSendEmail}>
                Encaminhar
              </Button>
              <Button onClick={handleSubmit}>Fechar</Button>
            </div>
          </div>
        </div>
      </div>

      <ScriptDetail title="Script" />
    </div>
  );
};

export default Recharges;
