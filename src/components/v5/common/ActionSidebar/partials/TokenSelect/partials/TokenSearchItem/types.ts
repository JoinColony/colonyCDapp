import { type TokenFragment } from '~gql';

export interface TokenSearchItemOption {
  label: string;
  value: string | number;
  isDisabled?: boolean;
  token?: TokenFragment;
}

export interface TokenSearchItemProps {
  options: TokenSearchItemOption[];
  onOptionClick?: (value: string | number) => void;
}
