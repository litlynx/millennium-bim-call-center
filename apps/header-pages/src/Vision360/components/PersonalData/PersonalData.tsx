import { useNavigate } from 'react-router';
import { Card, CardItemLabel, Icon } from 'shared/components';
import mockData from './mock-data/mock-data.json';

interface PersonalDataProps {
  data?: Record<string, string> | null;
}

const PersonalData: React.FC<PersonalDataProps> = ({ data }) => {
  const navigate = useNavigate();

  const items = data ?? mockData;

  return (
    <Card
      icon={<Icon type="personal" className="bg-primary-500" />}
      title="Dados Pessoais"
      className="h-full"
      onTitleClick={() => navigate('/personal-data?details=true')}
    >
      {items
        ? Object.entries(items).map(([label, value]) => (
            <CardItemLabel key={label} title={label} text={value} />
          ))
        : null}
    </Card>
  );
};

export default PersonalData;
