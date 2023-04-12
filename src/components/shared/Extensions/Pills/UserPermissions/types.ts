import { MessageDescriptor } from 'react-intl';
import { SimpleMessageValues } from '~types';

export interface UserPermissionsProps {
  text?: MessageDescriptor | string;
  textValues?: SimpleMessageValues;
  description?: MessageDescriptor | string;
  descriptionValues?: SimpleMessageValues;
  name: string;
}
