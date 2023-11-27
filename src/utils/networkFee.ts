import { BigNumber, BigNumberish } from 'ethers';

export const getAmountLessFee = (
  amount: BigNumberish,
  fee: BigNumberish,
): BigNumber => {
  const feeNumber = BigNumber.from(fee);

  if (!feeNumber.gt(0)) {
    return BigNumber.from(amount);
  }

  const feePercentage = BigNumber.from(100).div(fee);
  return BigNumber.from(amount)
    .mul(BigNumber.from(100).sub(feePercentage))
    .div(100);
};
