import { BigNumber } from 'ethers';

export const convertFromTokenToCurrency = (
  value?: string | null,
  conversionRate?: number | null,
) => {
  const precision = conversionRate ? 1000 : 1;
  const formattedConversionRate = conversionRate
    ? Math.floor(conversionRate * precision)
    : 0;

  return BigNumber.from(value ?? 0)
    .mul(formattedConversionRate)
    .div(precision)
    .toString();
};
