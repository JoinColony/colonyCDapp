import { MessageDescriptor } from 'react-intl';
import { TokenFragment } from '~gql';
import { BaseFieldProps } from '~v5/common/Fields/types';

export interface SearchSelectProps extends BaseFieldProps {
  items: SearchSelectOptionProps[];
  onSelect?: (value: string) => void;
  isLoading?: boolean;
  showSearchValueAsOption?: boolean;
  className?: string;
  hideSearchOnMobile?: boolean;
  onSearch?: (value: string) => void;
  showEmptyContent?: boolean;
  readonly?: boolean;
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
  token?: TokenFragment;
  isRoot?: boolean;
}
