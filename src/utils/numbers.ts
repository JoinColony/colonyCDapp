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

/**
 * Safely converts a given value to a numeric string. If the input value is `null`, `undefined`,
 * or an invalid number, a fallback value is used. If the provided fallback value is also invalid,
 * it defaults to "0".
 *
 * @param {string | number | null | undefined} value - The input value to convert.
 *    If it's a string, commas are removed before validation.
 * @param {string | number} [fallbackValue='0'] - The fallback value to use if the input value is
 *    invalid. If this fallback is not a valid number, it defaults to "0".
 * @returns {string} A numeric string representing the input value or a valid fallback.
 *
 * @example
 * getSafeStringifiedNumber("20,000") // "20000"
 * getSafeStringifiedNumber("abc", 100) // "100"
 * getSafeStringifiedNumber(null, "invalid") // "0"
 * getSafeStringifiedNumber(undefined) // "0"
 * getSafeStringifiedNumber(NaN, 50) // "50"
 */
export const getSafeStringifiedNumber = (
  value: string | number | null | undefined,
  fallbackValue: string | number = '0',
): string => {
  // Ensure the fallback value is a valid number
  const safeFallback = !Number.isNaN(Number(fallbackValue))
    ? String(fallbackValue)
    : '0';

  if (value === null || value === undefined) {
    // If value is null or undefined, use the safe fallback
    return safeFallback;
  }

  if (typeof value === 'string') {
    // Remove commas and check if the result is a valid number
    const numericString = value.replace(/,/g, '');
    return !Number.isNaN(Number(numericString)) ? numericString : safeFallback;
  }

  if (typeof value === 'number') {
    // Check if the number is NaN
    return Number.isNaN(value) ? safeFallback : String(value);
  }

  // Default case if the type is unexpected
  return safeFallback;
};
