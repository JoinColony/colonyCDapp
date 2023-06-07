import { Props as ReactModalProps } from 'react-modal';
import { ButtonMode } from '../Button/types';

export interface ModalBaseProps extends ReactModalProps {
  isFullOnMobile?: boolean;
}

export interface ModalProps extends ModalBaseProps {
  onClose: () => void;
  onConfirm?: () => Promise<void>;
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  icon?: string;
  isWarning?: boolean;
  confirmMessage?: React.ReactNode;
  closeMessage?: React.ReactNode;
  disabled?: boolean;
  buttonMode?: ButtonMode;
}
