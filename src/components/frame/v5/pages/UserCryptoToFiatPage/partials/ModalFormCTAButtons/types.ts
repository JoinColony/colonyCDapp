import { type MessageDescriptor } from 'react-intl';

export interface ModalFormCTAButtonsProps {
  className?: string;
  cancelButton: {
    onClick?: () => void;
    title: MessageDescriptor;
  };
  proceedButton: {
    // defined using the defineMessages() function
    title: MessageDescriptor;
  };
}
