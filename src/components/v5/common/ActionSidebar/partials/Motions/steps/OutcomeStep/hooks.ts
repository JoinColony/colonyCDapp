import { useMemo } from 'react';
import { supportOption, opposeOption } from '../../consts';
import { MotionVote } from '~utils/colonyMotions';
import { ColonyMotion } from '~types';
import { VoteStatuses } from './types';

export const useOutcomeStep = (motionData: ColonyMotion | null | undefined) => {
  const voteStatuses: VoteStatuses[] = useMemo(() => {
    if (!motionData) return [];
    const {
      motionStakes: {
        percentage: { yay: yayPercent, nay: nayPercent },
      },
    } = motionData;

    return [
      {
        id: supportOption.id,
        iconName: supportOption.iconName,
        label: supportOption.label || '',
        progress: Number(yayPercent),
        status: MotionVote.Yay,
      },
      {
        id: opposeOption.id,
        iconName: opposeOption.iconName,
        label: opposeOption.label || '',
        progress: Number(nayPercent),
        status: MotionVote.Nay,
      },
    ];
  }, [supportOption, motionData]);

  return {
    voteStatuses,
  };
};
