import Decimal from 'decimal.js';
import { BigNumber } from 'ethers';

export const getStakeFromSlider = (
  sliderAmount: number,
  remainingToStake: string,
  userMinStake: string,
) => {
  const exactStake = new Decimal(sliderAmount)
    .mul(BigNumber.from(remainingToStake).sub(userMinStake).toString())
    .div(100)
    .add(userMinStake)
    .floor()
    .toString();

  return BigNumber.from(exactStake);
};

/* BigNumbers round down, therefore if it's been rounded down to zero, display '1' */
export const getRemainingStakePercentage = (
  stake: BigNumber,
  remainingToStake: string,
) =>
  stake.mul(100).div(remainingToStake).isZero()
    ? '1'
    : stake.mul(100).div(remainingToStake).toString();
