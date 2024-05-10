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
