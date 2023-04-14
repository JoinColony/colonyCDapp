import { MessageDescriptor } from 'react-intl';
import { SimpleMessageValues } from '~types';

export interface UserPermissionsBadgeProps {
  text?: MessageDescriptor | string;
  textValues?: SimpleMessageValues;
  description?: MessageDescriptor | string;
  descriptionValues?: SimpleMessageValues;
  name: string;
}
