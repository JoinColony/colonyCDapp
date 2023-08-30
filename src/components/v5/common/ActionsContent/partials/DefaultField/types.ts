import { MessageDescriptor } from 'react-intl';

export type DefaultFieldProps = {
  name: string;
  placeholder: MessageDescriptor;
  isError?: boolean;
  maxLength?: number;
  defaultValue?: string;
};
