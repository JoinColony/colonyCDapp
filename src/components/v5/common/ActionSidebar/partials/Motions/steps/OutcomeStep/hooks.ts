import { useMemo } from 'react';
import { Id } from '@colony/colony-js';
import { supportOption, opposeOption } from '../../consts';
import { MotionVote } from '~utils/colonyMotions';
import { ColonyMotion } from '~types';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { useGetMembersForColonyQuery } from '~gql';
import { useColonyContext } from '~hooks';
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
        label: supportOption.label,
        progress: Number(yayPercent),
        status: MotionVote.Yay,
      },
      {
        id: opposeOption.id,
        iconName: opposeOption.iconName,
        label: opposeOption.label,
        progress: Number(nayPercent),
        status: MotionVote.Nay,
      },
    ];
  }, [supportOption, motionData]);

  return {
    voteStatuses,
  };
};

export const useMemberAvatars = (
  currentDomainId = COLONY_TOTAL_BALANCE_DOMAIN_ID,
) => {
  const { colony } = useColonyContext();

  const { data } = useGetMembersForColonyQuery({
    skip: !colony?.colonyAddress,
    variables: {
      input: {
        colonyAddress: colony?.colonyAddress ?? '',
        domainId: currentDomainId || Id.RootDomain,
      },
    },
    fetchPolicy: 'cache-and-network',
  });

  const watchers = data?.getMembersForColony?.watchers;

  return {
    watchers: watchers || [],
  };
};
