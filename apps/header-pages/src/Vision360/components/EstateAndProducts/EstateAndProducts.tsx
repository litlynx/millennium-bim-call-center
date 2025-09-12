import type * as React from 'react';
import { useNavigate } from 'react-router';
import { Card, Icon } from 'shared/components';
import mockData from './mock-data/mock-data.json';
import type {
  EstateAndProductsData,
  FinancialItemInterface,
  FinancialSectionInterface
} from './types';

interface FinancialItemProps {
  item: FinancialItemInterface;
  isLast?: boolean;
}

interface FinancialSectionProps {
  section: FinancialSectionInterface;
  className?: string;
}

const FinancialItem: React.FC<FinancialItemProps> = ({ item, isLast = false }) => (
  <div
    className={`flex justify-between items-center flex-wrap ${!isLast ? 'border-b border-gray-200 pb-1' : ''}`}
  >
    <span className="text-base">
      <span className="font-semibold">{item.name}</span>
      <span className="font-medium">{item.account ? ` - ${item.account}` : ''}</span>
    </span>
    <span className="flex text-base flex-wrap items-baseline">
      <span className="font-semibold pr-2">{item.amount}</span>
      <span className="text-gray-500">{item.currency}</span>
    </span>
  </div>
);

const FinancialSection: React.FC<FinancialSectionProps> = ({ section, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    <div className="flex justify-between items-center flex-wrap pb-[45px]">
      <h3 className="font-bold text-xl">{section.title}</h3>
      <span className="flex flex-wrap items-baseline">
        <h4 className="text-2xl pr-1 font-semibold">
          {section.total.amount.split(',')[0]}
          {section.total.amount.includes(',') && (
            <span className="text-lg">,{section.total.amount.split(',')[1]}</span>
          )}
        </h4>
        <span className="text-lg text-gray-500">{section.total.currency}</span>
      </span>
    </div>

    {section.items?.map((item, index) => (
      <FinancialItem
        key={`${item.name}-${index}`}
        item={item}
        isLast={index === section.items.length - 1}
      />
    ))}
  </div>
);

export default function EstateAndProducts(props: { data?: Partial<EstateAndProductsData> | null }) {
  const data: Partial<EstateAndProductsData> | null =
    props?.data === undefined ? (mockData.estateAndProducts as EstateAndProductsData) : props.data;
  const navigate = useNavigate();

  if (!data) {
    return (
      <Card
        icon={<Icon type="pieChart" className="bg-teal" />}
        title="Património e produtos"
        className="h-full"
        data-testid="estate-and-products-card"
      >
        <div className="flex items-center justify-center h-32">
          <span className="text-gray-500">Dados não disponíveis</span>
        </div>
      </Card>
    );
  }

  return (
    <Card
      icon={<Icon type="pieChart" className="bg-teal" />}
      title="Património e produtos"
      className="h-full"
      onTitleClick={() => navigate('/estate-and-products?details=true')}
      data-testid="estate-and-products-card"
    >
      <div className="grid grid-cols-2 divide-x divide-gray-200">
        {data.assets && (
          <FinancialSection
            section={data.assets}
            className={data.liabilities ? 'pr-4' : undefined}
          />
        )}
        {data.liabilities && (
          <FinancialSection
            section={data.liabilities}
            className={data.assets ? 'pl-4' : undefined}
          />
        )}
      </div>
    </Card>
  );
}
