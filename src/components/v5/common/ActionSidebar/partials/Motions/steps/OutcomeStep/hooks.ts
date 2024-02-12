import { useMemo } from 'react';

import { type ColonyMotion } from '~types/graphql.ts';
import { MotionVote } from '~utils/colonyMotions.ts';

import { supportOption, opposeOption } from '../../consts.ts';

import { type VoteStatuses } from './partials/VoteStatuses/types.ts';

export const useOutcomeStep = (motionData: ColonyMotion | null | undefined) => {
  const voteStatuses: VoteStatuses[] = useMemo(() => {
    if (!motionData) return [];
    const {
      revealedVotes: {
        percentage: { yay: yayPercent, nay: nayPercent },
      },
    } = motionData;

    return [
      {
        key: supportOption.id,
        icon: supportOption.icon,
        label: supportOption.label || '',
        progress: Number(yayPercent),
        status: MotionVote.Yay,
      },
      {
        key: opposeOption.id,
        icon: opposeOption.icon,
        label: opposeOption.label || '',
        progress: Number(nayPercent),
        status: MotionVote.Nay,
      },
    ];
  }, [motionData]);

  return {
    voteStatuses,
  };
};
