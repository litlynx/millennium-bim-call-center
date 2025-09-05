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
    className={`flex justify-between items-center ${!isLast ? 'border-b border-gray-200 pb-1' : ''}`}
  >
    <span className="text-sm">{item.name}</span>
    <span className="flex items-baseline">
      <span className="text-sm pr-2">{item.amount}</span>
      <span className="text-xs text-gray-500">{item.currency}</span>
    </span>
  </div>
);

const FinancialSection: React.FC<FinancialSectionProps> = ({ section, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    <div className="flex justify-between items-center pb-[45px]">
      <h3 className="font-bold">{section.title}</h3>
      <span className="flex items-baseline">
        <h4 className="text-md pr-2">{section.total.amount}</h4>
        <span className="text-sm text-gray-500">{section.total.currency}</span>
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

export default function EstateAndProducts() {
  const data: EstateAndProductsData = mockData.estateAndProducts;

  if (!data) {
    return (
      <Card
        icon={<Icon type="pieChart" className="bg-teal" />}
        title="Património e produtos"
        className="h-full"
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
    >
      <div className="grid grid-cols-2 divide-x divide-gray-200 pt-[0.625rem]">
        {data.assets && <FinancialSection section={data.assets} className="pr-4" />}
        {data.liabilities && <FinancialSection section={data.liabilities} className="pl-4" />}
      </div>
    </Card>
  );
}
