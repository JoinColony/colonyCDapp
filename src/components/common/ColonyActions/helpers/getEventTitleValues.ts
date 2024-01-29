import { type AnyMessageValues } from '~types/index.ts';

export const generateMessageValues = (
  item: Record<string, any>,
  keys: string[],
  initialEntry: Record<string, any>,
) =>
  keys.reduce<AnyMessageValues>(
    (values, key) => ({
      ...values,
      [key]: item[key],
    }),
    initialEntry,
  );
