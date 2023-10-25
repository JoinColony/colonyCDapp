import { useMemo } from 'react';
import { supportOption, opposeOption } from '../../consts';
import { MotionVote } from '~utils/colonyMotions';
import { ColonyMotion } from '~types';
import { VoteStatusesProps } from './partials/VoteStatuses/types';

export const useOutcomeStep = (motionData: ColonyMotion | null | undefined) => {
  const voteStatuses: VoteStatusesProps[] = useMemo(() => {
    if (!motionData) return [];
    const {
      motionStakes: {
        percentage: { yay: yayPercent, nay: nayPercent },
      },
    } = motionData;

    return [
      {
        key: supportOption.id,
        iconName: supportOption.iconName,
        label: supportOption.label || '',
        progress: Number(yayPercent),
        status: MotionVote.Yay,
      },
      {
        key: opposeOption.id,
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
