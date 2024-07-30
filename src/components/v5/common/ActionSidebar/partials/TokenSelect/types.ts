import { type TokenSearchItemOption } from './partials/TokenSearchItem/types.ts';

export interface TokenSelectProps {
  name: string;
  disabled?: boolean;
  readOnly?: boolean;
  filterOptionsFn?: (option: TokenSearchItemOption) => boolean;
}
