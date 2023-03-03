import Decimal from 'decimal.js';

import {
  SLIDER_AMOUNT_DEFAULT,
  SLIDER_AMOUNT_KEY,
  StakingWidgetValues,
  getFinalStake,
} from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/StakingWidget';
import { OnSuccess } from '~shared/Fields/Form/ActionHookForm';
import { useAppContext } from '~hooks';
import { DialogProps } from '~shared/Dialog';
import { Address, SetStateFn } from '~types';
import {
  getMotionStakingTransform,
  MotionStakes,
  updateMotionStakes,
  updateUsersStakes,
  UsersStakes,
} from './helpers';

interface UseRaiseObjectionDialogProps {
  remainingToFullyNayStaked: Decimal;
  minUserStake: Decimal;
  motionId: string;
  setMotionStakes: SetStateFn;
  setUsersStakes: SetStateFn;
  setIsSummary: SetStateFn;
  colonyAddress: Address;
}

const useRaiseObjectionDialog = (
  close: DialogProps['close'],
  {
    remainingToFullyNayStaked,
    minUserStake,
    motionId,
    setMotionStakes,
    setUsersStakes,
    setIsSummary,
    colonyAddress,
  }: UseRaiseObjectionDialogProps,
) => {
  const { user } = useAppContext();
  const transform = getMotionStakingTransform({
    colonyAddress,
    minUserStake,
    motionId,
    remainingToStake: remainingToFullyNayStaked,
    userAddress: user?.walletAddress ?? '',
    vote: 0,
  });

  const handleSuccess: OnSuccess<StakingWidgetValues> = (
    _,
    { amount },
    { reset },
  ) => {
    const finalStake = getFinalStake(
      amount,
      remainingToFullyNayStaked,
      minUserStake,
    );

    setIsSummary(true);
    setMotionStakes((motionStakes: MotionStakes) =>
      updateMotionStakes(motionStakes, finalStake, 0),
    );
    setUsersStakes((usersStakes: UsersStakes) =>
      updateUsersStakes(usersStakes, user?.walletAddress ?? '', finalStake, 0),
    );
    reset({ [SLIDER_AMOUNT_KEY]: SLIDER_AMOUNT_DEFAULT });
    close();
  };

  return { transform, handleSuccess };
};

export default useRaiseObjectionDialog;
