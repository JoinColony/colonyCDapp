import { MessageDescriptor } from 'react-intl';

export interface WalletPopoverOptionProps {
  icon: string;
  title: MessageDescriptor;
  description: MessageDescriptor;
  onClick: () => void;
}
