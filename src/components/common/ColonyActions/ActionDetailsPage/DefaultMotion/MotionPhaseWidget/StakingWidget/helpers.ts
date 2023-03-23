import { BigNumber } from 'ethers';

export const getStakeFromSlider = (
  sliderAmount: number,
  remainingToStake: string,
  userMinStake: string,
) =>
  BigNumber.from(sliderAmount)
    .mul(BigNumber.from(remainingToStake).sub(userMinStake))
    .div(100)
    .add(userMinStake);

/* BigNumbers round down, therefore if it's been rounded down to zero, display '1' */
export const getRemainingStakePercentage = (
  stake: BigNumber,
  remainingToStake: string,
) =>
  stake.mul(100).div(remainingToStake).isZero()
    ? '1'
    : stake.mul(100).div(remainingToStake).toString();
