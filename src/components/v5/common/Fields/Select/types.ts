import { MessageDescriptor } from 'react-intl';

export interface SelectProps<T> {
  selectedElement?: number;
  handleChange: (id: number) => void;
  list: T;
  isLoading?: boolean;
  placeholderText?: MessageDescriptor | string;
  isListRelative?: boolean;
  showAvatar?: boolean;
  openButtonClass?: string;
}
