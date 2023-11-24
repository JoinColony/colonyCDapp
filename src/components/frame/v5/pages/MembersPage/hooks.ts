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
    contributors,
    members,
    loadingContributors,
    loadingMembers,
    loadMoreContributors,
    moreContributors,
    loadMoreMembers,
    moreMembers,
    totalContributorCount,
    totalMemberCount,
  } = useMemberContext();
  const { colony } = useColonyContext();

  const contributorsList = useMemo<MembersTabContentListItem[]>(
    () =>
      contributors.map((contributor) => {
        const {
          contributorAddress,
          colonyReputationPercentage,
          user,
          isVerified,
          type,
        } = contributor;
        const allRoles = getAllUserRoles(colony, contributorAddress);
        const permissionRole = allRoles?.length ? getRole(allRoles) : undefined;
        const { walletAddress, profile } = user || {};
        const { bio, displayName, avatar, thumbnail } = profile || {};

        return {
          key: contributorAddress,
          userAvatarProps: {
            user,
            isVerified,
            aboutDescription: bio ?? '',
            userName: displayName ?? walletAddress ?? contributorAddress,
            avatar: avatar || thumbnail,
            seed: walletAddress && walletAddress.toLowerCase(),
            mode: type ? (type.toLowerCase() as UserStatusMode) : undefined,
            domains: getContributorBreakdown(contributor),
            walletAddress: walletAddress || '',
          },
          reputation: colonyReputationPercentage,
          role: permissionRole,
        };
      }),
    [colony, contributors],
  );

  const membersList = useMemo<MembersTabContentListItem[]>(
    () =>
      members.map((member) => {
        const {
          contributorAddress,
          colonyReputationPercentage,
          type,
          user,
          isVerified,
        } = member;
        const allRoles = getAllUserRoles(colony, contributorAddress);
        const permissionRole = getRole(allRoles);
        const { walletAddress, profile } = user || {};
        const { bio, displayName, avatar, thumbnail } = profile || {};

        return {
          key: contributorAddress,
          userAvatarProps: {
            user,
            isVerified,
            aboutDescription: bio ?? '',
            userName: displayName ?? walletAddress ?? contributorAddress,
            avatar: avatar || thumbnail,
            seed: walletAddress && walletAddress.toLowerCase(),
            mode: type ? (type.toLowerCase() as UserStatusMode) : undefined,
            domains: getContributorBreakdown(member),
            walletAddress: walletAddress || '',
          },
          reputation: colonyReputationPercentage,
          role: permissionRole,
        };
      }),
    [colony, members],
  );

  return {
    contributorsList,
    loadingContributors,
    hasMoreContributors: moreContributors,
    loadMoreContributors,
    membersList,
    loadingMembers,
    hasMoreMembers: moreMembers,
    loadMoreMembers,
    totalContributorCount,
    totalMemberCount,
  };
};
