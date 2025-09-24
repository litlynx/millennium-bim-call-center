import type * as React from 'react';
import { Helmet } from 'react-helmet';
import {
  Badge,
  ButtonDropdown,
  type CardTabItem,
  CardTabs,
  DatePicker,
  Icon,
  PageHeader,
  ScriptDetail,
  Table
} from 'shared/components';
import { useUserStore } from 'shared/stores';

const headers1 = [
  { key: 'company-name', label: 'Operadora', boldColumn: true },
  { key: 'number-cel', label: 'N.º Telefone' },
  { key: 'type', label: 'Tipo' },
  { key: 'state-sim-swap', label: 'Estado SIM Swap' },
  { key: 'state-contract', label: 'Estado Contrato' },
  { key: 'actions', label: '' }
];

const data1 = [
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

const headers2 = [
  { key: 'channel', label: 'Canal' },
  { key: 'type-transaction', label: 'Tipo Transação' },
  { key: 'amount', label: 'Montante' },
  { key: 'date', label: 'Data', className: 'text-right' },
  { key: 'hour', label: 'Hora' },
  { key: 'state-transaction', label: 'Estado da Transacção' }
];

const data2 = [
  {
    id: 'row-1',
    cells: [
      { content: 'Smart IZI' },
      { content: 'Transferência e-Mola' },
      { content: '123,00 MZN' },
      { content: '02-08-2025' },
      { content: '11:24:12' },
      {
        content: (
          <div className="flex items-center gap-2">
            <span>Processado</span>
            <Icon type="eye" className="p-0 cursor-pointer" />
          </div>
        )
      }
    ]
  },
  {
    id: 'row-2',
    cells: [
      { content: 'Smart IZI' },
      { content: 'Transferência BIM' },
      { content: '123,00 MZN' },
      { content: '02-08-2025' },
      { content: '11:24:12' },
      {
        content: (
          <div className="flex items-center gap-2">
            <span>Erro</span>
            <Icon type="eye" className="p-0 cursor-pointer" />
          </div>
        )
      }
    ]
  },
  {
    id: 'row-3',
    cells: [
      { content: 'Smart IZI' },
      { content: 'Transferência e-Mola' },
      { content: '123,00 MZN' },
      { content: '02-08-2025' },
      { content: '11:24:12' },
      {
        content: (
          <div className="flex items-center gap-2">
            <span>Processado</span>
            <Icon type="eye" className="p-0 cursor-pointer" />
          </div>
        )
      }
    ]
  }
];

const FiltersTransctionHistory: React.FC = () => {
  return (
    <div className="flex gap-16">
      <div className="flex flex-col gap-[0.625rem]">
        <p className="uppercase font-semibold text-xs text-gray-800">Contacto</p>
        <ButtonDropdown
          button="Contacto"
          content={
            <ul className="flex flex-col">
              <li className="px-3 py-2 hover:bg-gray-100 cursor-pointer">825816811</li>
              <li className="px-3 py-2 hover:bg-gray-100 cursor-pointer">845816811</li>
            </ul>
          }
        />
      </div>

      <div className="flex flex-col gap-[0.625rem]">
        <p className="uppercase font-semibold text-xs text-gray-800">Data</p>
        <DatePicker />
      </div>

      <div className="flex flex-col gap-[0.625rem]">
        <p className="uppercase font-semibold text-xs text-gray-800">Tipo de Operação</p>
        <ButtonDropdown
          button="Tipo Operação"
          content={
            <ul className="flex flex-col">
              <li className="px-3 py-2 hover:bg-gray-100 cursor-pointer">Todas</li>
              <li className="px-3 py-2 hover:bg-gray-100 cursor-pointer">Processado</li>
              <li className="px-3 py-2 hover:bg-gray-100 cursor-pointer">Erro</li>
            </ul>
          }
        />
      </div>
    </div>
  );
};

const TableTransctionHistory: React.FC = () => {
  return <Table headers={headers2} data={data2} />;
};

const transactionHistory: CardTabItem[] = [
  {
    value: 'transactionHistory',
    label: 'Histórico de Transacções',
    content: (
      <div className="flex flex-col gap-7 mt-6">
        <FiltersTransctionHistory />

        <TableTransctionHistory />
      </div>
    )
  }
];

const CancelsBlocked: React.FC = () => {
  const user = {
    customerName: useUserStore((u) => u.getCustomerName()),
    cif: useUserStore((u) => u.getCif()),
    accountNumber: useUserStore((u) => u.getAccountNumber())
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
          <Table headers={headers1} data={data1} />

          <div className="mt-6">
            <CardTabs className="h-full" tabs={transactionHistory} />
          </div>

          <div>footer/action</div>
        </div>
      </div>

      <ScriptDetail title="Script" />
    </div>
  );
};

export default CancelsBlocked;
