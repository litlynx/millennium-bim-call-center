import type * as React from 'react';
import { Card, CardItemLabel, Icon } from 'shared/components';

const PersonalData: React.FC = () => {
  return (
    <Card
      icon={<Icon type="personal" className="bg-primary-500" />}
      title="Dados Pessoais"
      className="h-fit"
    >
      <CardItemLabel key="titulo" title="Título" text="Doutor" />
      <CardItemLabel key="nome-sobrenome" title="Nome completo" text="Jacinto Fazenda Protótipo" />
      <CardItemLabel
        key="data-nascimento"
        title="Data de Nascimento"
        text="13 DE Fevereiro DE 2000"
      />
      <CardItemLabel key="genero" title="Género" text="Masculino" />
      <CardItemLabel key="nacionalidade" title="Nacionalidade" text="Moçambique" />
      <CardItemLabel key="pais-de-residencia" title="País de Residência" text="Moçambique" />
      <CardItemLabel key="nome-da-mae" title="Nome da Mãe" text="Jussara Assim Mesmo" />
      <CardItemLabel key="nome-do-pai" title="Nome do Pai" text="Fazenda aberta Protótipo" />
      <CardItemLabel key="estado-civil" title="Estado Civil" text="Casado" />
      <CardItemLabel key="nome-conjuge" title="Nome do Cônjuge" text="Berta Molinha Protótipo" />
    </Card>
  );
};

export default PersonalData;
