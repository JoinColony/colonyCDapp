import { MessageDescriptor } from 'react-intl';

export interface EmptyContentProps {
  title: MessageDescriptor | string;
  description: MessageDescriptor | string;
  icon: string;
  withBorder?: boolean;
  onClick?: () => void;
  buttonText?: string;
}
