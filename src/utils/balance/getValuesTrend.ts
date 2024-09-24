import { BigNumber } from 'ethers';
import numbro from 'numbro';

/**
 * To get the trend of the current value based on the previous value
 * We use the rule of three
 * previous ... 100%
 * (current - previous) ... x
 * @param current This is the current balance value
 * @param previous This is the previous balance value
 * @returns
 */

export const getValuesTrend = (current: string, previous: string) => {
  const currentBN = BigNumber.from(current);
  const previousBN = BigNumber.from(previous);
  const upperLimit = BigNumber.from(99999);

  let trend: BigNumber;

  if (currentBN.isZero() && previousBN.isZero()) {
    trend = BigNumber.from(0);
  } else if (currentBN.isZero()) {
    trend = BigNumber.from(-100);
  } else if (previousBN.isZero()) {
    trend = BigNumber.from(100);
  } else {
    trend = currentBN.sub(previousBN).mul(100).div(previousBN.abs());
  }

  const isIncrease = trend.gte(0);
  const isValueOverLimit = trend.abs().gt(upperLimit);
  const valueToFormat = isValueOverLimit ? upperLimit : trend.abs();

  const formattedValue = numbro(valueToFormat.toString()).format({
    mantissa: 3,
    trimMantissa: true,
    thousandSeparated: true,
  });

  return {
    value: `${formattedValue}%${isValueOverLimit ? '+' : ''}`,
    isIncrease,
  };
};
