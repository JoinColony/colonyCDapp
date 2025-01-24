import {
  type SearchSelectOption,
  type TeamOption,
} from '~v5/shared/SearchSelect/types.ts';

export interface TeamSelectProps {
  name: string;
  readonly?: boolean;
  filterOptionsFn?: (option: SearchSelectOption<TeamOption>) => boolean;
  disabled?: boolean;
}
