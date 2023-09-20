import { MessageDescriptor } from 'react-intl';

export interface SearchSelectProps {
  onToggle: () => void;
  items: SearchSelectOptionProps[];
  isOpen: boolean;
  onSelect?: (value: string) => void;
  isLoading?: boolean;
  className?: string;
  hideSearchOnMobile?: boolean;
}

export interface SearchSelectOptionProps {
  key: string;
  title: MessageDescriptor;
  isAccordion?: boolean;
  options: SearchSelectOption[];
}

export interface SearchSelectOption {
  label: MessageDescriptor | string;
  value: string;
  isDisabled?: boolean;
  avatar?: string;
  showAvatar?: boolean;
  color?: string;
  walletAddress?: string;
  nativeId?: number;
  missingPermissions?: string;
}
