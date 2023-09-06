import { MessageDescriptor } from 'react-intl';
import { STATUS_TYPES } from './consts';

export interface StatusTextProps {
  status: (typeof STATUS_TYPES)[keyof typeof STATUS_TYPES];
  title: string | MessageDescriptor;
  withIcon?: boolean;
  textClassName?: string;
}
