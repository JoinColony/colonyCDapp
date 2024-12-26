import {
  type SearchSelectOptionProps,
  type SearchSelectOption,
  type UserOption,
} from '~v5/shared/SearchSelect/types.ts';

export interface UserSelectProps {
  name: string;
  disabled?: boolean;
  domainId?: number;
  filterOptionsFn?: (option: SearchSelectOption<UserOption>) => boolean;
  tooltipContent?: React.ReactNode;
  options?: SearchSelectOptionProps<UserOption> & {
    isLoading?: boolean;
  };
}

// @TODO this is a temporary workaround, need to fix SearchSelect types
export interface UserSearchSelectOption extends SearchSelectOption<UserOption> {
  label: string;
}
