import { SearchSelectOptionProps } from '~v5/shared/SearchSelect/types';

export interface UserSelectHookProps extends SearchSelectOptionProps {
  isLoading: boolean;
  isUserVerified?: boolean;
  isRecipientNotVerified: boolean;
}

export interface UserSelectProps {
  name: string;
}
