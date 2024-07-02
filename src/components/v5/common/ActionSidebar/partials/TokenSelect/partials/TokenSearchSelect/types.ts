import { type BaseFieldProps } from '~v5/common/Fields/types.ts';

import { type TokenSearchItemOption } from '../TokenSearchItem/types.ts';

export interface TokenSearchSelectOptionProps {
  key: string;
  title: string;
  options: TokenSearchItemOption[];
}

export interface TokenSearchSelectProps extends BaseFieldProps {
  items: TokenSearchSelectOptionProps[];
  onSelect?: (value: string) => void;
  isLoading?: boolean;
  className?: string;
  hideSearchOnMobile?: boolean;
  onSearch?: (value: string) => void;
  showEmptyContent?: boolean;
  readonly?: boolean;
  additionalButtons?: React.ReactNode;
}
