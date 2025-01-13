import { type Icon } from '@phosphor-icons/react';
import { type MessageDescriptor } from 'react-intl';

import { type TokenFragment } from '~gql';
import { type BaseFieldProps } from '~v5/common/Fields/types.ts';

export type OptionRenderer<T> = (
  option: SearchSelectOption<T>,
  isLabelVisible?: boolean,
  isMobile?: boolean,
) => React.ReactNode;

export interface SearchSelectProps<T> extends BaseFieldProps {
  items: SearchSelectOptionProps<T>[];
  onSelect?: (value: string) => void;
  isLoading?: boolean;
  className?: string;
  hideSearchOnMobile?: boolean;
  onSearch?: (value: string) => void;
  showEmptyContent?: boolean;
  showSearchValueAsOption?: boolean;
  emptyContent?: React.ReactNode;
  readonly?: boolean;
  checkboxesList?: string[];
  additionalButtons?: React.ReactNode;
  placeholder?: string;
  shouldReturnAddresses?: boolean;
  renderOption: OptionRenderer<T>;
}

export interface SearchSelectOptionProps<T> {
  key: string;
  title?: MessageDescriptor;
  isAccordion?: boolean;
  options: SearchSelectOption<T>[];
}

export type SearchSelectOption<T> = T & {
  value: string | number;
  label: MessageDescriptor | string;
  isDisabled?: boolean;
};

export interface WithBadgesOption {
  isComingSoon?: boolean;
  isNew?: boolean;
}

export type WithBadgesOptionRendererProps = OptionRenderer<WithBadgesOption>;

export interface UserOption {
  avatar?: string;
  showAvatar?: boolean;
  walletAddress?: string;
  isVerified?: boolean;
  userReputation?: string;
  thumbnail?: string;
}

export type UserOptionRendererProps = OptionRenderer<UserOption>;

export interface TokenOption {
  token?: TokenFragment;
}

export type TokenOptionRendererProps = OptionRenderer<TokenOption>;

export interface TeamOption {
  color?: string;
  isRoot?: boolean;
}

export type TeamOptionRendererProps = OptionRenderer<TeamOption>;

export interface IconOption {
  icon: Icon;
}

export type IconOptionRendererProps = OptionRenderer<IconOption>;

export type AllSearchSelectOptions =
  | UserOption
  | TeamOption
  | TokenOption
  | IconOption
  | WithBadgesOption;

export const isUserSearchSelectOption = (
  option: SearchSelectOption<AllSearchSelectOptions>,
): option is SearchSelectOption<UserOption> => {
  if ('walletAddress' in option && option.walletAddress) {
    return true;
  }

  return false;
};
