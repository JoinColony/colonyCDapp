import { MessageDescriptor } from 'react-intl';

export interface PageTitleProps {
  title: MessageDescriptor;
  subtitle?: MessageDescriptor;
  hideColonies?: boolean;
}
