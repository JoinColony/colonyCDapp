import { BigNumber } from 'ethers';
import { getStakeFromSlider } from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/StakingWidget';
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
