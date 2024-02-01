import { MotionState as NetworkMotionState } from '@colony/colony-js';
import { BigNumber } from 'ethers';
import React, { useMemo } from 'react';

import { MotionState, getMotionState } from '~utils/colonyMotions.ts';
import MotionStateBadge from '~v5/common/Pills/MotionStateBadge/MotionStateBadge.tsx';

import { type MotionOutcomeBadgeProps } from './types.ts';

const displayName = 'v5.common.ActionSidebar.partials.MotionOutcomeBadge';

const MOTION_STATES_TO_SHOW = [MotionState.Failed, MotionState.Passed];

const MotionOutcomeBadge = ({
  motionData,
  motionState,
}: MotionOutcomeBadgeProps) => {
  const motionStateEnum: MotionState | undefined = useMemo(() => {
    if (!motionData) return undefined;
    const { requiredStake, motionStakes, revealedVotes } = motionData;
    const motionStakesRaw = motionStakes.raw;
    const revealedVotesPercentage = revealedVotes.percentage;

    if (
      motionState === NetworkMotionState.Finalizable &&
      BigNumber.from(motionStakesRaw.nay).gte(requiredStake) &&
      BigNumber.from(motionStakesRaw.yay).gte(requiredStake)
    ) {
      if (
        BigNumber.from(revealedVotesPercentage?.yay).gt(
          revealedVotesPercentage?.nay,
        )
      ) {
        return MotionState.Passed;
      }

      return MotionState.Failed;
    }

    if (
      [NetworkMotionState.Finalizable, NetworkMotionState.Finalized].includes(
        motionState ?? 0,
      ) &&
      BigNumber.from(motionStakesRaw.yay).eq(requiredStake)
    ) {
      return MotionState.Passed;
    }

    return getMotionState(motionState ?? 0, motionData);
  }, [motionData, motionState]);

  if (!motionStateEnum || !MOTION_STATES_TO_SHOW.includes(motionStateEnum)) {
    return null;
  }

  return (
    <div className="ml-auto mr-2">
      <MotionStateBadge state={motionStateEnum} />
    </div>
  );
};

MotionOutcomeBadge.displayName = displayName;

export default MotionOutcomeBadge;
