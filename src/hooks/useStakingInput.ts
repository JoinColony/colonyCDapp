import { useStakingWidgetContext } from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/StakingWidget';

import { MotionVote } from '~utils/colonyMotions';
import { getHandleStakeSuccessFn, getStakingTransformFn } from './helpers';
import { useAppContext, useColonyContext } from '.';

const useStakingInput = () => {
  const { user } = useAppContext();
  const { colony } = useColonyContext();
  const {
    isObjection,
    motionId,
    remainingToStake,
    userMinStake,
    setIsRefetching,
    startPollingAction,
  } = useStakingWidgetContext();

  const vote = isObjection ? MotionVote.Nay : MotionVote.Yay;

  const transform = getStakingTransformFn(
    remainingToStake,
    userMinStake,
    user?.walletAddress ?? '',
    colony?.colonyAddress ?? '',
    motionId,
    vote,
  );

  const handleSuccess = getHandleStakeSuccessFn(
    setIsRefetching,
    startPollingAction,
  );

  return { transform, handleSuccess, isObjection };
};

export default useStakingInput;
