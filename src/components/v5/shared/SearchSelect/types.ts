import { type Icon } from '@phosphor-icons/react';
import { type MessageDescriptor } from 'react-intl';

import { type TokenFragment } from '~gql';
import { type BaseFieldProps } from '~v5/common/Fields/types.ts';

export interface SearchSelectProps extends BaseFieldProps {
  items: SearchSelectOptionProps[];
  onSelect?: (value: string) => void;
  isLoading?: boolean;
  className?: string;
  hideSearchOnMobile?: boolean;
  onSearch?: (value: string) => void;
  showEmptyContent?: boolean;
  readonly?: boolean;
  checkboxesList?: string[];
  additionalButtons?: React.ReactNode;
  placeholder?: string;
}

export interface SearchSelectOptionProps {
  key: string;
  title: MessageDescriptor;
  isAccordion?: boolean;
  options: SearchSelectOption[];
}

export interface SearchSelectOption {
  label: MessageDescriptor | string;
  value: string | number;
  isDisabled?: boolean;
  isComingSoon?: boolean;
  isNew?: boolean;
  avatar?: string;
  thumbnail?: string;
  showAvatar?: boolean;
  color?: string;
  icon?: Icon;
  walletAddress?: string;
  nativeId?: number;
  token?: TokenFragment;
  isRoot?: boolean;
  isVerified?: boolean;
  userReputation?: string;
}
