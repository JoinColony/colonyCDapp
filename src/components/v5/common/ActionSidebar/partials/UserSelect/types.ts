import { SearchSelectOptionProps } from '~v5/shared/SearchSelect/types';

export interface UserSelectHookProps extends SearchSelectOptionProps {
  loading: boolean;
}

export interface UserSelectProps {
  name: string;
}
