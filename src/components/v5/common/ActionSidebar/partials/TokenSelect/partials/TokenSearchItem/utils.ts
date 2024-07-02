import { type TokenSearchItemOption } from './types.ts';

export const sortDisabled = (options: TokenSearchItemOption[]) => {
  const enabled = options.filter((option) => !option.isDisabled);
  const disabled = options.filter((option) => option.isDisabled);

  return [...enabled, ...disabled];
};
