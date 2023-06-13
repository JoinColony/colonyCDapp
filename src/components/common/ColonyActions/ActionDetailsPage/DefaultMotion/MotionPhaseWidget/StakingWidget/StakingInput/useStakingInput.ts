import { useAppContext, useColonyContext } from '~hooks';

import { MotionVote } from '~utils/colonyMotions';
import { useStakingWidgetContext } from '../StakingWidgetProvider';
import { getHandleStakeSuccessFn, getStakingTransformFn } from './helpers';

export const useStakingInput = () => {
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

  return {
    transform,
    handleSuccess,
    isObjection,
  };
};
