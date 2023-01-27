import { MessageDescriptor } from 'react-intl';

export interface Appearance {
  theme?: 'default' | 'alt' | 'grey' | 'grid';
}

export interface SelectOption {
  label: MessageDescriptor | string;
  value: string;
}
