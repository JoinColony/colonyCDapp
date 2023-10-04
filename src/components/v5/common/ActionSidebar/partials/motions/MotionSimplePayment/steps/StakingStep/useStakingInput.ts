import { useAppContext, useColonyContext } from '~hooks';

import { useUserTokenBalanceContext } from '~context';
import { getHandleStakeSuccessFn, getStakingTransformFn } from './helpers';

export const useStakingInput = (
  isObjection,
  motionId,
  remainingToStake,
  userMinStake,
  setIsRefetching,
  startPollingAction,
) => {
  const { user } = useAppContext();
  const { colony } = useColonyContext();
  const { pollLockedTokenBalance } = useUserTokenBalanceContext();

  // const vote = isObjection ? MotionVote.Nay : MotionVote.Yay;

  const transform = getStakingTransformFn(
    remainingToStake,
    userMinStake,
    user?.walletAddress ?? '',
    colony?.colonyAddress ?? '',
    motionId,
    // vote,
  );

  const handleSuccess = getHandleStakeSuccessFn(
    setIsRefetching,
    startPollingAction,
    pollLockedTokenBalance,
  );

  return {
    transform,
    handleSuccess,
    isObjection,
  };
};
