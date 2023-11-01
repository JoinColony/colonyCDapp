import Decimal from 'decimal.js';

/**
 * Function calculating and formatting the amount of reputation decay in the next day
 */
export const getReputationDecayInNextDay = (
  currentReputation: string,
  nativeTokenDecimals: number,
) => {
  const convertedReputation = new Decimal(currentReputation);
  const nextDayDecay = convertedReputation.sub(
    convertedReputation.mul(new Decimal(0.5).pow(1 / 90)),
  );
  return nextDayDecay
    .div(new Decimal(10).pow(nativeTokenDecimals))
    .round()
    .toString();
};
