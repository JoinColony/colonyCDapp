import { convertFromTokenToCurrency } from './convertFromTokenToCurrency.ts';

export const convertFromTokenToClny = (
  tokenPriceInUSD: string,
  clnyPriceInUSD: number,
) => {
  const USDinCLNY = 1 / clnyPriceInUSD;

  return convertFromTokenToCurrency(tokenPriceInUSD, USDinCLNY);
};
