import type React from 'react';
import { Button, Icon, Modal } from 'shared/components';

interface ConfirmModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onOpenChange,
  title,
  description,
  onConfirm,
  onCancel
}) => (
  <Modal
    isOpen={isOpen}
    onOpenChange={onOpenChange}
    title={title}
    description={description}
    icon={
      <Icon
        type="danger"
        className="bg-primary p-2 font-bold h-[57px] w-[57px] rounded-xl"
        size="lg"
      />
    }
    footer={
      <div className="flex justify-end gap-3">
        <Button variant="light" size="lg" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="solid" size="lg" onClick={onConfirm}>
          Confirmar
        </Button>
      </div>
    }
    size="md"
    className="bg-white"
  >
    {null}
  </Modal>
);

export default ConfirmModal;
