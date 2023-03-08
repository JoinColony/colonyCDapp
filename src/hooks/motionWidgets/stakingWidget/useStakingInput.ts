import { BigNumber } from 'ethers';
import { useRef } from 'react';

import {
  getFinalStake,
  useStakingWidgetContext,
} from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/StakingWidget';

import { useAppContext, useColonyContext } from '~hooks';
import { mapPayload } from '~utils/actions';

import { mapStakingSliderProps } from './helpers';

const useStakingInput = () => {
  const { user } = useAppContext();
  const { colony } = useColonyContext();
  const mutableRef = useRef<{ limitExceeded: boolean }>();
  const limitExceeded = !!mutableRef.current?.limitExceeded;

  const {
    minUserStake,
    maxUserStake,
    motionId,
    isObjection,
    remainingToStake,
    enoughTokens,
    canBeStaked,
    userActivatedTokens,
    nativeTokenDecimals,
    nativeTokenSymbol,
    totalPercentage,
    getErrorType,
    reputationLoading,
  } = useStakingWidgetContext();

  const transform = mapPayload(({ amount }) => {
    const finalStake = getFinalStake(amount, remainingToStake, minUserStake);

    return {
      amount: finalStake,
      userAddress: user?.walletAddress,
      colonyAddress: colony?.colonyAddress,
      motionId: BigNumber.from(motionId),
      vote: isObjection ? 0 : 1,
    };
  });

  const stakingSliderProps = mapStakingSliderProps({
    isObjection,
    minUserStake,
    remainingToStake,
    canBeStaked,
    maxUserStake,
    userActivatedTokens,
    enoughTokens,
    totalPercentage,
    getErrorType,
    nativeTokenDecimals,
    nativeTokenSymbol,
    reputationLoading,
    mutableRef,
  });

  return { transform, stakingSliderProps, mutableRef, limitExceeded };
};

export default useStakingInput;
