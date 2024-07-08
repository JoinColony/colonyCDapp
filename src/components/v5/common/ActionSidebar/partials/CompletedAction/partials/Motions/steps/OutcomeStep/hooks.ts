import { ThumbsDown, ThumbsUp } from '@phosphor-icons/react';
import { useMemo } from 'react';

import { type ColonyMotion } from '~types/graphql.ts';
import { MotionVote } from '~utils/colonyMotions.ts';
import { formatText } from '~utils/intl.ts';
import { type UserAvatarsItem } from '~v5/shared/UserAvatars/types.ts';

import { type VoteStatuses } from './partials/VoteStatuses/types.ts';

export const useOutcomeStep = (motionData: ColonyMotion | null | undefined) => {
  const supportOption = {
    label: formatText({ id: 'motion.support' }),
    id: 'support',
    icon: ThumbsUp,
  };
  const opposeOption = {
    label: formatText({ id: 'motion.oppose' }),
    id: 'oppose',
    icon: ThumbsDown,
  };

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
  }, [
    motionData,
    opposeOption.icon,
    opposeOption.id,
    opposeOption.label,
    supportOption.icon,
    supportOption.id,
    supportOption.label,
  ]);

  const stakingData = useMemo(() => {
    if (!motionData) return undefined;

    const { usersStakes } = motionData;

    const stakers = usersStakes.flatMap((userStakes) => {
      const { address, stakes } = userStakes;

      const yay = Number(stakes.percentage.yay);
      const nay = Number(stakes.percentage.nay);
      const addresses: UserAvatarsItem[] = [];

      if (yay > 0) {
        addresses.push({ address, voteCount: '1', vote: MotionVote.Yay });
      }

      if (nay > 0) {
        addresses.push({ address, voteCount: '1', vote: MotionVote.Nay });
      }

      return addresses;
    });

    // 100 is hardcoded because in userStakes total wasn't 100% (it was like 98%). Probably because of rounding.
    const stakeVoteStatuses: VoteStatuses[] = [
      {
        key: supportOption.id,
        icon: supportOption.icon,
        label: supportOption.label || '',
        progress: 100,
        status: MotionVote.Yay,
      },
      {
        key: opposeOption.id,
        icon: opposeOption.icon,
        label: opposeOption.label || '',
        progress: 100,
        status: MotionVote.Nay,
      },
    ];

    return {
      stakers,
      stakeVoteStatuses,
    };
  }, [
    motionData,
    opposeOption.icon,
    opposeOption.id,
    opposeOption.label,
    supportOption.icon,
    supportOption.id,
    supportOption.label,
  ]);

  return {
    voteStatuses,
    stakingData,
  };
};
