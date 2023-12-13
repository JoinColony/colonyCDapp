import { useMemo } from 'react';

import { useMemberContext } from '~context/MemberContext';
import { useColonyContext } from '~hooks';
import { useGetSelectedTeamFilter } from '~hooks/useTeamsBreadcrumbs';

import { MembersTabContentListItem } from './partials/MembersTabContent/types';
import { getMembersList } from './utils';

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
  const selectedTeam = useGetSelectedTeamFilter();

  const contributorsList = useMemo<MembersTabContentListItem[]>(
    () => getMembersList(pagedContributors, selectedTeam?.nativeId, colony),
    [colony, pagedContributors, selectedTeam],
  );

  const membersList = useMemo<MembersTabContentListItem[]>(
    () => getMembersList(pagedMembers, selectedTeam?.nativeId, colony),
    [colony, pagedMembers, selectedTeam],
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
