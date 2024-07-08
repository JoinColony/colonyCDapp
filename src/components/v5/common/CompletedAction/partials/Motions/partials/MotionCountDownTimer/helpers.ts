import { type GetMotionTimeoutPeriodsReturn } from '~gql';
import { MotionState } from '~utils/colonyMotions.ts';

export const splitTimeLeft = (period: number) => ({
  days: Math.floor(period / (60 * 60 * 24)),
  hours: Math.floor((period / (60 * 60)) % 24),
  minutes: Math.floor((period / 60) % 60),
  seconds: Math.floor(period % 60),
});

export const getCurrentStatePeriodInMs = (
  motionState: MotionState,
  motionTimeoutPeriods: GetMotionTimeoutPeriodsReturn,
) => {
  switch (motionState) {
    case MotionState.Staking:
    case MotionState.Supported:
    case MotionState.Opposed:
      return motionTimeoutPeriods.timeLeftToStake;
    case MotionState.Voting:
      return motionTimeoutPeriods.timeLeftToVote;
    case MotionState.Reveal:
      return motionTimeoutPeriods.timeLeftToReveal;
    case MotionState.Escalated:
      return motionTimeoutPeriods.timeLeftToEscalate;
    default:
      return '-1';
  }
};
