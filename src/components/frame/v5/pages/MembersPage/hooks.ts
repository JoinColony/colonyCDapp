import { useMemo } from 'react';

import { getRole } from '~constants/permissions';
import { useMemberContext } from '~context/MemberContext';
import { useColonyContext } from '~hooks';
import { getContributorBreakdown } from '~hooks/members/useContributorBreakdown';
import { getAllUserRoles } from '~transformers';
import { UserStatusMode } from '~v5/common/Pills/types';

import { MembersTabContentListItem } from './partials/MembersTabContent/types';

export const useMembersPage = () => {
  const {
    members,
    contributors,
    pagedContributors,
    pagedMembers,
    loading,
    loadMoreContributors,
    moreContributors,
    loadMoreMembers,
    moreMembers,
  } = useMemberContext();
  const { colony } = useColonyContext();

  const contributorsList = useMemo<MembersTabContentListItem[]>(
    () =>
      pagedContributors.map((contributor) => {
        const {
          contributorAddress,
          colonyReputationPercentage,
          user,
          isVerified,
          type,
        } = contributor;
        const allRoles = getAllUserRoles(colony, contributorAddress);
        const permissionRole = allRoles?.length ? getRole(allRoles) : undefined;
        const { profile } = user || {};
        const { bio, displayName, avatar, thumbnail } = profile || {};

        return {
          key: contributorAddress,
          userAvatarProps: {
            user,
            isVerified,
            aboutDescription: bio ?? '',
            userName: displayName ?? contributorAddress,
            avatar: avatar || thumbnail,
            seed: contributorAddress.toLowerCase(),
            mode: type ? (type.toLowerCase() as UserStatusMode) : undefined,
            domains: getContributorBreakdown(contributor),
            walletAddress: contributorAddress,
          },
          reputation: colonyReputationPercentage,
          role: permissionRole,
        };
      }),
    [colony, pagedContributors],
  );

  const membersList = useMemo<MembersTabContentListItem[]>(
    () =>
      pagedMembers.map((member) => {
        const {
          contributorAddress,
          colonyReputationPercentage,
          type,
          user,
          isVerified,
        } = member;
        const allRoles = getAllUserRoles(colony, contributorAddress);
        const permissionRole = getRole(allRoles);
        const { profile } = user || {};
        const { bio, displayName, avatar, thumbnail } = profile || {};

        return {
          key: contributorAddress,
          userAvatarProps: {
            user,
            isVerified,
            aboutDescription: bio ?? '',
            userName: displayName ?? contributorAddress,
            avatar: avatar || thumbnail,
            seed: contributorAddress.toLowerCase(),
            mode: type ? (type.toLowerCase() as UserStatusMode) : undefined,
            domains: getContributorBreakdown(member),
            walletAddress: contributorAddress,
          },
          reputation: colonyReputationPercentage,
          role: permissionRole,
        };
      }),
    [colony, pagedMembers],
  );

  const sortedContributorCount = contributors.length;
  const sortedMemberCount = members.length;

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
