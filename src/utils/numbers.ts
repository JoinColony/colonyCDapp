import { BigNumber } from 'ethers';

export const toNumber = (value: any): number => {
  return BigNumber.from(value).toNumber();
};
