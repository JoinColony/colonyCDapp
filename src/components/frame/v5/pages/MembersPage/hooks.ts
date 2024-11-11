import { useMemo } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMemberContext } from '~context/MemberContext/MemberContext.ts';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';

import { getMembersList } from './utils.ts';

export const useMembersPage = () => {
  const {
    filteredMembers,
    filteredContributors,
    pagedContributors,
    pagedMembers,
    loading,
    loadMoreContributors,
    moreContributors,
    loadMoreMembers,
    moreMembers,
    totalMemberCount,
    totalContributorCount,
    hasActiveFilter,
  } = useMemberContext();
  const { colony } = useColonyContext();
  const selectedDomain = useGetSelectedDomainFilter();

  const contributorsList = useMemo(
    () => getMembersList(pagedContributors, selectedDomain?.nativeId, colony),
    [colony, pagedContributors, selectedDomain],
  );

  const membersList = useMemo(
    // Members list should not be filtered by domain
    () => getMembersList(pagedMembers, undefined, colony),
    [colony, pagedMembers],
  );

  const sortedContributorCount =
    hasActiveFilter || !!selectedDomain?.nativeId
      ? filteredContributors.length
      : totalContributorCount;

  const sortedMemberCount = hasActiveFilter
    ? filteredMembers.length
    : totalMemberCount;

  return {
    contributorsList,
    loading,
    hasMoreContributors: moreContributors,
    loadMoreContributors,
    membersList,
    hasMoreMembers: moreMembers,
    loadMoreMembers,
    sortedContributorCount,
    sortedMemberCount,
    totalContributorCount,
  };
};
