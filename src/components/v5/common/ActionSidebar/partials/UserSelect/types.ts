import {
  type SearchSelectOptionProps,
  type SearchSelectOption,
} from '~v5/shared/SearchSelect/types.ts';

export interface UserSelectProps {
  name: string;
  disabled?: boolean;
  domainId?: number;
  filterOptionsFn?: (option: SearchSelectOption) => boolean;
  tooltipContent?: React.ReactNode;
  options?: SearchSelectOptionProps & {
    isLoading?: boolean;
  };
}

// @TODO this is a temporary workaround, need to fix SearchSelect types
export interface UserSearchSelectOption extends SearchSelectOption {
  label: string;
}
