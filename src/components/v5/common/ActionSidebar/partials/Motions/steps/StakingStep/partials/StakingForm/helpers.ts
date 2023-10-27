import { BigNumber } from 'ethers';
import moveDecimal from 'move-decimal-point';

import { SetStateFn } from '~types';
import { mapPayload } from '~utils/actions';
import { MotionVote } from '~utils/colonyMotions';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import { StakeMotionPayload } from './types';

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

export const getPredictedPercentage = (
  voteTypeValue: MotionVote | undefined,
  amount: string,
  tokenDecimals: number,
  supportRemaining: string,
  opposeRemaining: string,
) => {
  let predictedPercentage = 0;

  try {
    predictedPercentage =
      voteTypeValue !== undefined
        ? BigNumber.from(
            moveDecimal(amount, getTokenDecimalsWithFallback(tokenDecimals)) ||
              '0',
          )
            .mul(100)
            .div(
              BigNumber.from(
                voteTypeValue === MotionVote.Yay
                  ? supportRemaining
                  : opposeRemaining,
              ),
            )
            .toNumber()
        : 0;
  } catch {
    predictedPercentage = 0;
  }

  return predictedPercentage;
};
