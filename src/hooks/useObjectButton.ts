import { useFormContext } from 'react-hook-form';

import {
  getStakingTransformFn,
  useStakingWidgetContext,
} from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/StakingWidget';
import { SLIDER_AMOUNT_KEY } from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/StakingWidget/StakingInput';
import { RaiseObjectionDialog } from '~common/Dialogs';
import { useDialog } from '~shared/Dialog';
import { MotionVote } from '~utils/colonyMotions';

import useAppContext from './useAppContext';
import useColonyContext from './useColonyContext';

const useObjectButton = () => {
  const { user } = useAppContext();
  const { colony } = useColonyContext();
  const { getValues } = useFormContext();
  const openRaiseObjectionDialog = useDialog(RaiseObjectionDialog);
  const {
    remainingStakes: [nayRemaining],
    userMinStake,
    motionId,
    setIsSummary,
  } = useStakingWidgetContext();

  const transform = getStakingTransformFn(
    nayRemaining,
    userMinStake,
    user?.walletAddress ?? '',
    colony?.colonyAddress ?? '',
    motionId,
    MotionVote.Nay,
  );

  const canUserStakedNay = !!(user && nayRemaining !== '0');

  const handleObjection = () =>
    openRaiseObjectionDialog({
      canBeStaked: canUserStakedNay,
      transform,
      setIsSummary,
      amount: getValues(SLIDER_AMOUNT_KEY),
    });

  return { handleObjection, canUserStakedNay };
};

export default useObjectButton;
