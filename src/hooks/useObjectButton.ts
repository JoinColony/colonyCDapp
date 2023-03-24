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
    canBeStaked,
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

  const handleObjection = () => {
    openRaiseObjectionDialog({ canBeStaked, transform });
  };

  return { handleObjection };

  /* totalNAYStakes.isZero()
      ? openRaiseObjectionDialog({ stakingSliderProps })
      : setIsSummary(true); */
};

export default useObjectButton;
