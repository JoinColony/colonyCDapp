import { type MilestoneState } from './types.ts';

export const getMilestoneStateWithFallback = (state?: MilestoneState) =>
  state || {
    allMilestonesSlotIdsAwaitingRelease: [],
    currentMilestonesAwaitingRelease: [],
    isPendingStagesRelease: false,
  };
