import { useFormContext } from 'react-hook-form';

import {
  useStakingWidgetContext,
  SLIDER_AMOUNT_KEY,
} from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/StakingWidget';
import { RaiseObjectionDialog } from '~common/Dialogs';
import { useDialog } from '~shared/Dialog';
import { MotionVote } from '~utils/colonyMotions';

import { getHandleStakeSuccessFn, getStakingTransformFn } from './helpers';
import { useAppContext, useColonyContext } from '.';

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
    setIsRefetching,
    startPollingAction,
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

  const handleStakeSuccess = getHandleStakeSuccessFn(
    setIsRefetching,
    startPollingAction,
  );

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
