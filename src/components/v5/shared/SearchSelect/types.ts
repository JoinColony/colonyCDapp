import { MessageDescriptor } from 'react-intl';
import { TokenFragment } from '~gql';
import { BaseFieldProps } from '~v5/common/Fields/types';

export interface SearchSelectProps extends BaseFieldProps {
  onToggle: () => void;
  items: SearchSelectOptionProps[];
  isOpen: boolean;
  onSelect?: (value: string) => void;
  isLoading?: boolean;
  isDefaultItemVisible?: boolean;
  className?: string;
  hideSearchOnMobile?: boolean;
  onSearch?: (value: string) => void;
  showEmptyContent?: boolean;
}

export interface SearchSelectOptionProps {
  key: string;
  title: MessageDescriptor;
  isAccordion?: boolean;
  options: SearchSelectOption[];
}

export interface SearchSelectOption {
  label?: MessageDescriptor | string | null;
  value?: string | null;
  isDisabled?: boolean;
  avatar?: string | null;
  showAvatar?: boolean;
  color?: string;
  walletAddress?: string;
  nativeId?: number;
  missingPermissions?: string;
  token?: TokenFragment;
}
