import Decimal from 'decimal.js';
import { BigNumber } from 'ethers';
import moveDecimal from 'move-decimal-point';

import { Action, ActionTypes } from '~redux';
import { SetStateFn } from '~types';
import { mapPayload } from '~utils/actions';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

type StakeMotionPayload = Action<ActionTypes.MOTION_STAKE>['payload'];

/**
 * Utility to determine if user's reputation in the domain is less than the amount still needed to stake, i.e. their
 * staking ability is limited, not by their number of tokens activated, but by their (lack of) reputation.
 */
export const userHasInsufficientReputation = (
  userActivatedTokens: BigNumber,
  userMaxStake: BigNumber,
  remainingToStake: string,
) => userActivatedTokens.gt(userMaxStake) && userMaxStake.lt(remainingToStake);

/**
 *
 * Utility to determine whether the remaining amount to be staked is less than the user's minimum stake. (i.e. can't
 * stake more than 100% of a motion)
 */

export const userCanStakeMore = (
  userMinStake: string,
  remainingToStake: string,
) => BigNumber.from(remainingToStake).gte(userMinStake);

export const getStakeFromSlider = (
  sliderAmount: number,
  remainingToStake: string,
  userMinStake: string,
) => {
  if (sliderAmount === 100) {
    return BigNumber.from(remainingToStake);
  }

  const exactStake = new Decimal(sliderAmount)
    .mul(BigNumber.from(remainingToStake).sub(userMinStake).toString())
    .div(100)
    .add(userMinStake)
    .floor()
    .toString();

  return BigNumber.from(exactStake);
};

export const getStakingTransformFn = (
  userAddress: string,
  colonyAddress: string,
  motionId: string,
  nativeTokenDecimals: number | undefined,
  actionId?: string,
) =>
  mapPayload(({ amount, voteType }) => {
    const amountValue = BigNumber.from(
      moveDecimal(amount, getTokenDecimalsWithFallback(nativeTokenDecimals)),
    );

    return {
      amount: amountValue,
      userAddress,
      colonyAddress,
      motionId: BigNumber.from(motionId),
      vote: voteType,
      actionId,
    } as StakeMotionPayload;
  });

export const getHandleStakeSuccessFn =
  (
    setIsRefetching: SetStateFn,
    startPollingMotion: (pollingInterval: number) => void,
    pollLockedTokenBalance: () => void,
  ) =>
  (_, { reset }) => {
    reset();
    setIsRefetching(true);
    /* On stake success, initiate db polling so ui updates */
    startPollingMotion(1000);
    pollLockedTokenBalance();
  };

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
