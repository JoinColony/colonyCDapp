import { useFormContext } from 'react-hook-form';

import {
  useStakingWidgetContext,
  SLIDER_AMOUNT_KEY,
  StakingWidgetValues,
} from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/StakingWidget';
import { RaiseObjectionDialog } from '~common/Dialogs';
import { useDialog } from '~shared/Dialog';
import { OnSuccess } from '~shared/Fields';
import { MotionVote } from '~utils/colonyMotions';

import { getStakingTransformFn } from './helpers';
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

  const handleStakeSuccess: OnSuccess<StakingWidgetValues> = (_, { reset }) => {
    reset();
  };
  const handleObjection = () =>
    openRaiseObjectionDialog({
      canBeStaked: canUserStakedNay,
      transform,
      handleStakeSuccess,
      setIsSummary,
      amount: getValues(SLIDER_AMOUNT_KEY),
    });

  return { handleObjection, canUserStakedNay };
};

export default useObjectButton;
