import { useMemo } from 'react';
import { supportOption, opposeOption } from '../../consts';
import { MotionVote } from '~utils/colonyMotions';
import { ColonyMotion } from '~types';

export const useOutcomeStep = (motionData: ColonyMotion | null | undefined) => {
  const voteStatuses = useMemo(() => {
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
        label: supportOption.label,
        progress: yayPercent,
        status: MotionVote.Yay,
      },
      {
        id: opposeOption.id,
        iconName: opposeOption.iconName,
        label: opposeOption.label,
        progress: nayPercent,
        status: MotionVote.Nay,
      },
    ];
  }, [supportOption, motionData]);

  return {
    voteStatuses,
    yayPercent: motionData?.motionStakes?.percentage?.yay || '',
    nayPercent: motionData?.motionStakes?.percentage?.nay || '',
  };
};
