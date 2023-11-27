import { MotionState } from '~utils/colonyMotions';

import useEnabledExtensions from './useEnabledExtensions';

const useShouldDisplayMotionCountdownTime = (
  motionState: MotionState | null,
) => {
  const { isVotingReputationEnabled } = useEnabledExtensions();

  return (
    isVotingReputationEnabled &&
    !!motionState &&
    [MotionState.Staking, MotionState.Reveal, MotionState.Voting].includes(
      motionState,
    )
  );
};

export default useShouldDisplayMotionCountdownTime;
