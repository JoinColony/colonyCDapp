import { MessageDescriptor } from 'react-intl';

export type DefaultFieldProps = {
  name: string;
  placeholder: MessageDescriptor;
  defaultValue?: string;
  isError?: boolean;
  maxLength?: number;
  defaultValue?: string;
};
