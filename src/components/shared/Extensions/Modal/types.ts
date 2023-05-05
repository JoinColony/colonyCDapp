import { Props as ReactModalProps } from 'react-modal';

export type ModalBaseProps = ReactModalProps;
export interface ModalProps extends ModalBaseProps {
  onClose: () => void;
  icon?: string;
  isWarning?: boolean;
}
