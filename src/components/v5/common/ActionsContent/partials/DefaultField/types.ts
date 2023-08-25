import { MessageDescriptor } from 'react-intl';

export type DefaultFieldProps = {
  name: string;
  placeholder: MessageDescriptor;
  isErrors: boolean;
  defaultValue?: string;
};
