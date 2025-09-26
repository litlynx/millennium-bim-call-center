import type React from 'react';
import { Icon, Modal } from 'shared/components';

interface SuccessModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  message: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onOpenChange, message }) => (
  <Modal
    isOpen={isOpen}
    onOpenChange={onOpenChange}
    title={null}
    description={null}
    footer={null}
    size="sm"
    className="bg-white text-center"
  >
    <div className="flex flex-col items-center justify-center py-4">
      <Icon
        type="check"
        className="bg-gray-100 text-green-500 font-bold h-[57px] w-[57px] rounded-full p-1 mb-4"
        size="lg"
      />
      <p className="text-xl color-gray-800">{message}</p>
    </div>
  </Modal>
);

export default SuccessModal;
