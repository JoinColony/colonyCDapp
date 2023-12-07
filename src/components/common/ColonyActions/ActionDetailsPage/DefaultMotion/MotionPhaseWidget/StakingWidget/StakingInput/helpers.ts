import { BigNumber } from 'ethers';

import { SetStateFn } from '~types';
import { mapPayload } from '~utils/actions';

import { getStakeFromSlider } from '../helpers';

export const getStakingTransformFn = (
  remainingToStake: string,
  userMinStake: string,
  userAddress: string,
  colonyAddress: string,
  motionId: string,
  vote: number,
  actionId?: string,
) =>
  mapPayload(({ amount: sliderAmount, annotation: annotationMessage }) => {
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
      annotationMessage,
      actionId,
    };
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
