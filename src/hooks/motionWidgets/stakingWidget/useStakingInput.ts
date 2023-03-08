import Decimal from 'decimal.js';
import { BigNumber } from 'ethers';
import { useRef } from 'react';

import {
  getFinalStake,
  useStakingWidgetContext,
} from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/StakingWidget';
import { StakingWidgetValues } from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/StakingWidget/StakingInput/StakingInput';

import { useAppContext, useColonyContext } from '~hooks';
import { OnSuccess } from '~shared/Fields/Form/ActionHookForm';
import { MotionData } from '~types';
import { mapPayload } from '~utils/actions';

import {
  getMotionSide,
  mapStakingSliderProps,
  updateUsersStakes,
  UsersStakes,
} from './helpers';

type MotionStakes = MotionData['motionStakes'];

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
    setMotionStakes,
    setUsersStakes,
  } = useStakingWidgetContext();

  const vote = isObjection ? 0 : 1;

  const getFinalStakeFromSliderAmount = (sliderAmount: number) =>
    getFinalStake(sliderAmount, remainingToStake, minUserStake);

  const transform = mapPayload(({ amount }) => {
    const finalStake = getFinalStakeFromSliderAmount(amount);

    return {
      amount: finalStake,
      userAddress: user?.walletAddress,
      colonyAddress: colony?.colonyAddress,
      motionId: BigNumber.from(motionId),
      vote,
    };
  });

  const handleSuccess: OnSuccess<StakingWidgetValues> = (
    _,
    { amount },
    { reset },
  ) => {
    reset();
    const finalStake = getFinalStakeFromSliderAmount(amount);
    setMotionStakes((motionStakes: MotionStakes) => {
      const side = getMotionSide(vote);
      const updatedStake = new Decimal(motionStakes[side]).add(finalStake);

      return {
        ...motionStakes,
        [side]: updatedStake.toString(),
      };
    });
    setUsersStakes((usersStakes: UsersStakes) =>
      updateUsersStakes(
        usersStakes,
        user?.walletAddress ?? '',
        finalStake,
        vote,
      ),
    );
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
