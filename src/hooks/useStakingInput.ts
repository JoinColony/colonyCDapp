import {
  useStakingWidgetContext,
  getStakingTransformFn,
  StakingWidgetValues,
} from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/StakingWidget';
import { OnSuccess } from '~shared/Fields';
import { MotionVote } from '~utils/colonyMotions';

import useAppContext from './useAppContext';
import useColonyContext from './useColonyContext';

const useStakingInput = () => {
  const { user } = useAppContext();
  const { colony } = useColonyContext();

  const {
    canBeStaked,
    isObjection,
    motionId,
    remainingStakes: [nayRemaining, yayRemaining],
    userMinStake,
  } = useStakingWidgetContext();

  const vote = isObjection ? MotionVote.Nay : MotionVote.Yay;
  const remainingToStake = isObjection ? nayRemaining : yayRemaining;

  const transform = getStakingTransformFn(
    remainingToStake,
    userMinStake,
    user?.walletAddress ?? '',
    colony?.colonyAddress ?? '',
    motionId,
    vote,
  );

  const handleSuccess: OnSuccess<StakingWidgetValues> = (_, { reset }) => {
    reset();
  };

  return { transform, handleSuccess, canBeStaked, isObjection };
};

export default useStakingInput;
