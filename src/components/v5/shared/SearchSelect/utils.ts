import { type SearchSelectOption } from './types.ts';

export const sortDisabled = (options: SearchSelectOption[]) => {
  const enabled = options.filter((option) => !option.isDisabled);
  const disabled = options.filter((option) => option.isDisabled);

  return [...enabled, ...disabled];
};
