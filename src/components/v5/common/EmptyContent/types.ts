import { type Icon } from '@phosphor-icons/react';
import { type MessageDescriptor } from 'react-intl';

export interface EmptyContentProps {
  title?: MessageDescriptor | string;
  description: MessageDescriptor | string;
  icon?: Icon;
  withBorder?: boolean;
  onClick?: () => void;
  buttonText?: MessageDescriptor | string;
  withoutButtonIcon?: boolean;
  className?: string;
  buttonIcon?: Icon;
  isDropdown?: boolean;
}
