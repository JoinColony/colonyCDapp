import {
  getStakingTransformFn,
  useStakingWidgetContext,
} from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/StakingWidget';
import { RaiseObjectionDialog } from '~common/Dialogs';
import { useDialog } from '~shared/Dialog';
import { MotionVote } from '~utils/colonyMotions';

import useAppContext from './useAppContext';
import useColonyContext from './useColonyContext';

const useObjectButton = () => {
  const { user } = useAppContext();
  const { colony } = useColonyContext();
  const openRaiseObjectionDialog = useDialog(RaiseObjectionDialog);
  const {
    remainingStakes: [nayRemaining],
    userMinStake,
    motionId,
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

  const handleObjection = () => {
    openRaiseObjectionDialog({ canBeStaked: canUserStakedNay, transform });
  };

  return { handleObjection, canUserStakedNay };
};

export default useObjectButton;
