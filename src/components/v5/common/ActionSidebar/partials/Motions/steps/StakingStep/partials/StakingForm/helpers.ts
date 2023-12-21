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
  tokenAddress: string,
  activeAmount: string,
  actionId?: string,
) =>
  mapPayload(({ amount, voteType }) => {
    const amountValue = BigNumber.from(
      moveDecimal(amount, getTokenDecimalsWithFallback(nativeTokenDecimals)),
    );
    const activateTokens = amountValue.gt(activeAmount);

    return {
      amount: amountValue,
      userAddress,
      colonyAddress,
      motionId: BigNumber.from(motionId),
      vote: voteType,
      tokenAddress,
      activateTokens,
      activeAmount,
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

/**
 * Function returning the max amount user can stake which is the smaller of
 * the available tokens balance and the remaining oppose or support stake amounts
 */
export const getMaxStakeAmount = (
  voteType: MotionVote,
  availableBalance: BigNumber,
  remainingStakes: string[],
) => {
  const opposeRemaining = BigNumber.from(remainingStakes[0] ?? '0');
  const supportRemaining = BigNumber.from(remainingStakes[1] ?? '0');
  const remaining =
    voteType === MotionVote.Yay ? supportRemaining : opposeRemaining;

  if (availableBalance.gt(remaining)) {
    return remaining;
  }

  return availableBalance;
};
