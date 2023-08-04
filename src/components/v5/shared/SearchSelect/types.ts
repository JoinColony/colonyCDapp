import { MessageDescriptor } from 'react-intl';

export interface SearchSelectProps {
  onToggle: () => void;
  items: SearchSelectOptionProps[];
  isOpen: boolean;
}

export interface SearchSelectOptionProps {
  key: string;
  title: MessageDescriptor;
  isAccordion?: boolean;
  options: SearchSelectOption[];
}

export interface SearchSelectOption {
  label: MessageDescriptor;
  value: string;
  isDisabled?: boolean;
}
