import { BigNumber } from 'ethers';

import { Action, ActionTypes } from '~redux';
import { SetStateFn } from '~types';
import { mapPayload } from '~utils/actions';

import { getStakeFromSlider } from '../helpers';

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
