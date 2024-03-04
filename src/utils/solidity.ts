import { type BigNumberish, utils } from 'ethers';

export const toB32 = (input: BigNumberish) =>
  utils.hexZeroPad(utils.hexlify(input), 32);
