import { BigNumber, BigNumberish } from 'ethers';

export const getAmountLessFee = (
  amount: BigNumberish,
  fee: BigNumberish,
): BigNumber => {
  const feePercentage = BigNumber.from(100).div(fee);
  return BigNumber.from(amount)
    .mul(BigNumber.from(100).sub(feePercentage))
    .div(100);
};
