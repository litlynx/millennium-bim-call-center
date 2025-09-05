import { Card, CardItemLabel, Icon } from 'shared/components';

const PersonalData: React.FC = () => {
  return (
    <Card
      icon={<Icon type="personal" className="bg-primary-500" />}
      title="Dados Pessoais"
      className="h-fit"
    >
      <CardItemLabel title="Título" text="Doutor" />
      <CardItemLabel title="Nome completo" text="Jacinto Fazenda Protótipo" />
      <CardItemLabel title="Data de Nascimento" text="13 DE Fevereiro DE 2000" />
      <CardItemLabel title="Género" text="Masculino" />
      <CardItemLabel title="Nacionalidade" text="Moçambique" />
      <CardItemLabel title="País de Residência" text="Moçambique" />
      <CardItemLabel title="Nome da Mãe" text="Jussara Assim Mesmo" />
      <CardItemLabel title="Nome do Pai" text="Fazenda aberta Protótipo" />
      <CardItemLabel title="Estado Civil" text="Casado" />
      <CardItemLabel title="Nome do Cônjuge" text="Berta Molinha Protótipo" />
    </Card>
  );
};

export default PersonalData;
