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
  } = useMemberContext();
  const { colony } = useColonyContext();
  const selectedDomain = useGetSelectedDomainFilter();

  const contributorsList = useMemo(
    () => getMembersList(pagedContributors, selectedDomain?.nativeId, colony),
    [colony, pagedContributors, selectedDomain],
  );

  const membersList = useMemo(
    () => getMembersList(pagedMembers, selectedDomain?.nativeId, colony),
    [colony, pagedMembers, selectedDomain],
  );

  const sortedContributorCount = filteredContributors.length;
  const sortedMemberCount = filteredMembers.length;

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
  };
};
