import { Card, CardItemLabel, Icon } from 'shared/components';
import dataJson from './mock-data/mock-data.json';

const PersonalData: React.FC = () => {
  return (
    <Card
      icon={<Icon type="personal" className="bg-primary-500" />}
      title="Dados Pessoais"
      className="h-fit"
    >
      {Object.entries(dataJson as Record<string, string>).map(([label, value]) => (
        <CardItemLabel key={label} title={label} text={value} />
      ))}
    </Card>
  );
};

export default PersonalData;
