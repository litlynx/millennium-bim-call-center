import { Helmet } from 'react-helmet';
import { Button, PageHeader, ScriptDetail, TextArea, useTextArea } from 'shared/components';
import { useUserStore } from 'shared/stores';
import { PrimaryTable } from '../components/cancelsBlocked/PrimaryTable';
import { mockPrimaryRows } from '../mocks/mockPrimaryRows';

const Accesses: React.FC = () => {
  const user = {
    customerName: useUserStore((u) => u.getCustomerName()),
    cif: useUserStore((u) => u.getCif()),
    accountNumber: useUserStore((u) => u.getAccountNumber())
  };

  const textArea = useTextArea({
    required: true,
    maxLength: 2000,
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

  const handleSendEmail = () => {
    if (textArea.value.trim() === '') {
      console.log('Cannot send email: Text area is empty.');
      return;
    }
    console.log('Sending email to bocanaisremotos@bim.co.mz', textArea.value);
  };

  return (
    <div className="grid h-full min-h-0 grid-cols-2 gap-4 overflow-hidden w-full">
      <Helmet>
        <title>Acessos</title>
      </Helmet>

      <div className="flex min-h-0 flex-col overflow-hidden">
        <PageHeader
          type="channelAndService"
          channelCategory="Canais Digitais"
          serviceTitle="Smart IZI - Acessos"
          user={user}
        />

        <div className="mt-3 flex flex-1 min-h-0 flex-col rounded-[1.25rem] bg-white overflow-hidden">
          <div className="overflow-y-auto px-9 py-6 flex flex-col h-full justify-between">
            <div className="flex flex-col gap-6">
              <div className="min-h-[100px]">
                <PrimaryTable data={mockPrimaryRows} />
              </div>
            </div>

            <div className="pt-6">
              <TextArea
                title="Registo"
                placeholder="Motivo da Chamada"
                {...textArea.textAreaProps}
              />
              <div className="mt-[2.6875rem] flex justify-end gap-3">
                <Button variant="outline" onClick={handleSendEmail}>
                  Encaminhar
                </Button>
                <Button onClick={handleSubmit}>Fechar</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ScriptDetail title="Script" />
    </div>
  );
};

export default Accesses;
