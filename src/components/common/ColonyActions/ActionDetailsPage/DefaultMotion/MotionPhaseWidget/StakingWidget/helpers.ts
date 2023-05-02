import Decimal from 'decimal.js';
import { BigNumber } from 'ethers';

import { userHasInsufficientReputation } from './StakingInput';

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

export const calculateStakeLimitDecimal = (
  remainingToStake: string,
  userMinStake: string,
  userMaxStake: BigNumber,
  userTotalStake: string,
  userActivatedTokens: BigNumber,
) => {
  // corresponds to cantStakeMore error
  if (BigNumber.from(remainingToStake).lt(userMinStake)) {
    return new Decimal(0);
  }
  const stakingLimit = userMaxStake.gte(userActivatedTokens)
    ? userActivatedTokens
    : userMaxStake;

  let adjustedStakingLimit = stakingLimit.sub(userMinStake);

  /*
   * Corresponds to moreRepNeeded error. If a user's ability to stake is limited
   * by their reputation, then every time they stake, the limit should decrease to reflect
   * the fact their total stake is getting closer to their max stake.
   */
  if (
    userHasInsufficientReputation(
      userActivatedTokens,
      userMaxStake,
      remainingToStake,
    )
  ) {
    adjustedStakingLimit = adjustedStakingLimit.sub(userTotalStake);
  }

  // Accounts for the user's minimum stake, which is the slider's start point (i.e 0%)
  const adjustedRemainingToStake =
    BigNumber.from(remainingToStake).sub(userMinStake);

  if (adjustedStakingLimit.gte(adjustedRemainingToStake)) {
    return new Decimal(1);
  }

  const stakeDecimal = new Decimal(adjustedStakingLimit.toString()).div(
    adjustedRemainingToStake.toString(),
  );

  return stakeDecimal.lt(0) ? new Decimal(0) : stakeDecimal;
};
