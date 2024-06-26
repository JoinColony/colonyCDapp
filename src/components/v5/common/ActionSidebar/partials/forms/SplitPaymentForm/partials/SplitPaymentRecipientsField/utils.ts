import Decimal from 'decimal.js';

export const calculatePercentageValue = (
  value: string | undefined,
  total: string,
) =>
  new Decimal(value || '0').mul(100).div(total).toDecimalPlaces(4).toNumber();
