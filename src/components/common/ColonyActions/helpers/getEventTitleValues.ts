import { type AnyMessageValues } from '~types/index.ts';
import { truncateTokenSymbol } from '~utils/strings.ts';

export const generateMessageValues = (
  item: Record<string, any>,
  keys: string[],
  initialEntry: Record<string, any>,
) =>
  keys.reduce<AnyMessageValues>(
    (values, key) => ({
      ...values,
      [key]: key === 'tokenSymbol' ? truncateTokenSymbol(item[key]) : item[key],
    }),
    initialEntry,
  );
