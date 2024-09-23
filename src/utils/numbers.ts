import { BigNumber } from 'ethers';

export const toNumber = (value: any): number => {
  return BigNumber.from(value).toNumber();
};

export const convertEnotationToNumber = (value: string) => {
  const match = value.match(/^(\d+)(\.(\d+))?[eE]([-+]?\d+)$/);

  if (!match) {
    return value;
  }

  const [, integer, , tail, exponentStr] = match;
  const exponent = Number(exponentStr);
  const realInteger = integer + (tail || '');
  if (exponent > 0) {
    const realExponent = Math.abs(exponent + integer.length);
    return realInteger.padEnd(realExponent, '0');
  }
  const realExponent = Math.abs(exponent - (tail?.length || 0));
  return `0.${realInteger.padStart(realExponent, '0')}`;
};

/**
 * Adjusts an array of percentages so that they sum up to exactly 100% after rounding to the specified number of decimal places.
 * It does this by calculating the rounding difference and adding it to the largest percentage value.
 *
 * @param percentages - An array of percentage values.
 * @param decimals - The number of decimal places to round to.
 * @returns A new array of percentages adjusted to sum up to 100%.
 */
export const adjustPercentagesTo100 = (
  percentages: number[],
  decimals: number,
) => {
  const multiplier = 10 ** decimals;
  // Total sum needed (e.g., 10000 for two decimals)
  const total = 100 * multiplier;
  // Convert percentages to integer representations based on the specified decimals
  const scaledValues = percentages.map((value) => value * multiplier);
  // Round each value to the nearest integer
  const roundedValues = scaledValues.map((value) => Math.round(value));
  // Sum the rounded values
  const sumRounded = roundedValues.reduce((acc, val) => acc + val, 0);
  // Calculate the difference to reach the total
  const delta = total - sumRounded;
  // Find the index of the largest value in the original array
  const maxIndex = roundedValues.indexOf(Math.max(...roundedValues));
  // Adjust the largest value by adding the delta
  roundedValues[maxIndex] += delta;
  // Convert back to percentages with the specified number of decimals
  return roundedValues.map((value) => value / multiplier);
};
