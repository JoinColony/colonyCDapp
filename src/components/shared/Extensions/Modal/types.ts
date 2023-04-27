import { MessageDescriptor } from 'react-intl';
import { Props as ReactModalProps } from 'react-modal';

export type ModalBaseProps = ReactModalProps;
export interface ModalProps extends ModalBaseProps {
  onClose: () => void;
  title?: MessageDescriptor | string;
  icon?: string;
  isWarning?: boolean;
}
