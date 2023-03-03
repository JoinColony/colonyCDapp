import { useRef } from 'react';

import {
  getFinalStake,
  useStakingWidgetContext,
  StakingWidgetValues,
} from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/StakingWidget';

import { useAppContext, useColonyContext } from '~hooks';
import { OnSuccess } from '~shared/Fields/Form/ActionHookForm';

import {
  getMotionStakingTransform,
  mapStakingSliderProps,
  MotionStakes,
  updateMotionStakes,
  updateUsersStakes,
  UsersStakes,
} from './helpers';

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
    totalNAYStakes,
    remainingToStake,
    enoughTokens,
    canBeStaked,
    userActivatedTokens,
    nativeTokenDecimals,
    nativeTokenSymbol,
    totalPercentage,
    getErrorType,
    reputationLoading,
    setMotionStakes,
    setUsersStakes,
    setIsSummary,
  } = useStakingWidgetContext();

  const vote = isObjection ? 0 : 1;
  const transform = getMotionStakingTransform({
    colonyAddress: colony?.colonyAddress ?? '',
    minUserStake,
    motionId,
    remainingToStake,
    vote,
    userAddress: user?.walletAddress ?? '',
  });

  const handleSuccess: OnSuccess<StakingWidgetValues> = (
    _,
    { amount },
    { reset },
  ) => {
    const finalStake = getFinalStake(amount, remainingToStake, minUserStake);
    reset();
    setMotionStakes((motionStakes: MotionStakes) =>
      updateMotionStakes(motionStakes, finalStake, vote),
    );
    setUsersStakes((usersStakes: UsersStakes) =>
      updateUsersStakes(
        usersStakes,
        user?.walletAddress ?? '',
        finalStake,
        vote,
      ),
    );

    const showSummary = isObjection || totalNAYStakes.gt(0);

    if (showSummary) {
      setIsSummary(true);
    }
  };

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

  return {
    transform,
    handleSuccess,
    stakingSliderProps,
    limitExceeded,
  };
};

export default useStakingInput;
