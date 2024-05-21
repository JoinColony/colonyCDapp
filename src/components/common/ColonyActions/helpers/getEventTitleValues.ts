import { type AnyMessageValues } from '~types/index.ts';

const formattedTokenSymbol = (tokenSymbol?: string) => {
  if (tokenSymbol) {
    return tokenSymbol.length > 5
      ? `${tokenSymbol.slice(0, 5)}...`
      : tokenSymbol;
  }

  return tokenSymbol;
};

export const generateMessageValues = (
  item: Record<string, any>,
  keys: string[],
  initialEntry: Record<string, any>,
) =>
  keys.reduce<AnyMessageValues>(
    (values, key) => ({
      ...values,
      [key]:
        key === 'tokenSymbol' ? formattedTokenSymbol(item[key]) : item[key],
    }),
    initialEntry,
  );
