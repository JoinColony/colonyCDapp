import { MessageDescriptor } from 'react-intl';

export interface NavItemProps {
  disabled?: boolean;
  linkTo: string;
  label: MessageDescriptor | string;
}
