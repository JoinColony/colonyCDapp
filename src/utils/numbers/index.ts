import { BigNumberish, BigNumber } from 'ethers';

export { numberDisplayFormatter } from './numberFormatter';
export { minimalFormatter } from './numberFormatter';
/**
 * Return whether `a` is less than `b` where each are number-like values.
 */
export const bnLessThan = (a: BigNumberish, b: BigNumberish) =>
  BigNumber.from(a).lt(BigNumber.from(b));

export const halfPlusOne = (count: number) => Math.floor(count / 2) + 1;
