import { BigNumber } from 'ethers';
import moveDecimal from 'move-decimal-point';

import { Action, ActionTypes } from '~redux';
import { SetStateFn } from '~types';
import { mapPayload } from '~utils/actions';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

type StakeMotionPayload = Action<ActionTypes.MOTION_STAKE>['payload'];

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
