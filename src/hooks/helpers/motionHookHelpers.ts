import Decimal from 'decimal.js';
import { BigNumber } from 'ethers';
import {
  getStakeFromSlider,
  userHasInsufficientReputation,
} from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/StakingWidget';

import { MotionStakes } from '~gql';
import { Action, ActionTypes } from '~redux';
import { SetStateFn } from '~types';
import { mapPayload } from '~utils/actions';

type StakeMotionPayload = Action<ActionTypes.MOTION_STAKE>['payload'];

export const getStakingTransformFn = (
  remainingToStake: string,
  userMinStake: string,
  userAddress: string,
  colonyAddress: string,
  motionId: string,
  vote: number,
) =>
  mapPayload(({ amount: sliderAmount }) => {
    const finalStake = getStakeFromSlider(
      sliderAmount,
      remainingToStake,
      userMinStake,
    );

    return {
      amount: finalStake,
      userAddress,
      colonyAddress,
      motionId: BigNumber.from(motionId),
      vote,
    } as StakeMotionPayload;
  });

export const compareMotionStakes = (
  oldMotionStakes: MotionStakes,
  newMotionStates: MotionStakes | undefined,
) =>
  oldMotionStakes.raw.yay !== newMotionStates?.raw.yay ||
  oldMotionStakes.raw.nay !== newMotionStates?.raw.nay;

export const getHandleStakeSuccessFn =
  (
    setIsRefetching: SetStateFn,
    startPolling: (pollingInterval: number) => void,
  ) =>
  (_, { reset }) => {
    reset();
    setIsRefetching(true);
    /* On stake success, initiate db polling so ui updates */
    startPolling(1000);
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
