import { Props as ReactModalProps } from 'react-modal';

export interface ModalBaseProps extends ReactModalProps {
  isFullOnMobile?: boolean;
}

export interface ModalProps extends ModalBaseProps {
  onClose: () => void;
  icon?: string;
  isWarning?: boolean;
}
