import { useMemo } from 'react';

import { useMemberContext } from '~context/MemberContext/MemberContext.ts';
import { type ColonyContributorFragment } from '~gql';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';

import { type ContributorItem } from '../types.ts';

export const getContibutorsByDomain = (
  members: ColonyContributorFragment[],
  selectedTeamId: number | undefined,
): ContributorItem[] => {
  const isAllTeamsSelected = selectedTeamId === undefined;

  return members.map((contributor) => {
    const { contributorAddress, colonyReputationPercentage, user, reputation } =
      contributor;

    const teamReputationPercentage = reputation?.items?.find(
      (item) => item?.domain?.nativeId === selectedTeamId,
    )?.reputationPercentage;

    return {
      user,
      walletAddress: contributorAddress,
      reputation: isAllTeamsSelected
        ? colonyReputationPercentage
        : teamReputationPercentage,
    };
  });
};

export const useContributorsByDomain = () => {
  const { totalMembers, loading } = useMemberContext();

  const allContributors = useMemo(
    () =>
      totalMembers.filter(({ hasReputation }) => hasReputation).sort() ?? [],
    [totalMembers],
  );

  const selectedDomain = useGetSelectedDomainFilter();

  const contributorsWithReputationByDomain = useMemo(
    () => getContibutorsByDomain(allContributors, selectedDomain?.nativeId),
    [allContributors, selectedDomain],
  );

  const contributorsList = contributorsWithReputationByDomain
    .filter((contributor) => !!contributor.reputation)
    .sort((a, b) => Number(b.reputation) - Number(a.reputation));

  return {
    contributorsList,
    loading,
  };
};
