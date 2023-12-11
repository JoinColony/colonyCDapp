import { SearchSelectOption } from '~v5/shared/SearchSelect/types';

export interface TeamSelectProps {
  name: string;
  readonly?: boolean;
  filterOptionsFn?: (option: SearchSelectOption) => boolean;
}
