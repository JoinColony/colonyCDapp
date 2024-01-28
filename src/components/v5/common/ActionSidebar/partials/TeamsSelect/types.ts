import { type SearchSelectOption } from '~v5/shared/SearchSelect/types.ts';

export interface TeamSelectProps {
  name: string;
  readonly?: boolean;
  filterOptionsFn?: (option: SearchSelectOption) => boolean;
}
