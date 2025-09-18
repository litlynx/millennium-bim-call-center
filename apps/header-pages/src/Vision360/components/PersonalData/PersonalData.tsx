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
      data-testid="personal-data-card"
      headerTestId="personal-data-header"
      titleTestId="personal-data-title"
      contentTestId="personal-data-content"
    >
      <div className="pt-[1.5625rem]">
        {items
          ? Object.entries(items).map(([label, value], index) => (
              <CardItemLabel key={label} title={label} text={value} dataTestId={`personal-data-item-${index}`}/>
            ))
          : null}
      </div>
    </Card>
  );
};

export default PersonalData;
