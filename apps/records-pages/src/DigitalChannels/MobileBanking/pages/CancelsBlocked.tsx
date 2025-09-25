import type * as React from 'react';
import { Helmet } from 'react-helmet';
import { Button, PageHeader, TextArea, useTextArea } from 'shared/components';
import { useUserStore } from 'shared/stores';

const CancelsBlocked: React.FC = () => {
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

  const handleSubmit = () => {
    const isValid = textArea.validate();

    if (isValid) {
      console.log('Form submitted successfully!');
      console.log('Text content:', textArea.value);
    } else {
      console.log('Form validation failed:', textArea.error);
    }
  };

  return (
    <>
      <PageHeader
        type="channelAndService"
        channelCategory="Canais Digitais"
        serviceTitle="Smart IZI - Cancelamento/Bloqueio"
        user={user}
      />
      <Helmet>
        <title>Acessos</title>
      </Helmet>

      <div className="p-[2.25rem] bg-white rounded-[20px]">
        <TextArea title="Registo" placeholder="Motivo da Chamada" {...textArea.textAreaProps} />
        <Button className="mt-[2.6875rem] ml-auto block" onClick={handleSubmit}>
          Fechar
        </Button>
      </div>
    </>
  );
};

export default CancelsBlocked;
