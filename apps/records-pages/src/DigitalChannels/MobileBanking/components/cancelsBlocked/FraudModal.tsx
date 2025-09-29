import type React from 'react';
import { Button, Icon, Modal } from 'shared/components';

interface FraudModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onChoice: (isFraud: boolean) => void;
}

const FraudModal: React.FC<FraudModalProps> = ({ isOpen, onOpenChange, onChoice }) => (
  <Modal
    isOpen={isOpen}
    onOpenChange={onOpenChange}
    title="Cancelamento Mobile Banking"
    description="Pretende cancelar por fraude?"
    icon={
      <Icon
        type="danger"
        className="bg-primary p-2 font-bold h-[57px] w-[57px] rounded-xl"
        size="lg"
      />
    }
    footer={
      <div className="flex justify-end gap-3">
        <Button variant="light" size="lg" onClick={() => onChoice(false)}>
          Não
        </Button>
        <Button variant="solid" size="lg" onClick={() => onChoice(true)}>
          Sim
        </Button>
      </div>
    }
    size="md"
    className="bg-white"
  >
    {null}
  </Modal>
);

export default FraudModal;
