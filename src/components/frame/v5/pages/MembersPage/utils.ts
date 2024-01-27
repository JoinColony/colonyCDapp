import { ColonyRole, Id } from '@colony/colony-js';

import { getRole } from '~constants/permissions.ts';
import { ColonyContributorFragment, ColonyFragment } from '~gql';
import { getContributorBreakdown } from '~hooks/members/useContributorBreakdown.ts';
import { getAllUserRoles } from '~transformers/index.ts';
import { UserStatusMode } from '~v5/common/Pills/types.ts';

export const getMembersList = (
  members: ColonyContributorFragment[],
  selectedTeamId: number | undefined,
  colony: ColonyFragment,
) => {
  return members.map((contributor) => {
    const {
      contributorAddress,
      colonyReputationPercentage,
      user,
      isVerified,
      type,
      roles,
      reputation,
    } = contributor;
    const { items } = roles || {};
    const hasRoleInTeam = items?.some((item) => {
      const { domain } = item || {};

      return (
        domain?.nativeId === selectedTeamId ||
        domain?.nativeId === Id.RootDomain
      );
    });
    const allRoles = getAllUserRoles(colony, contributorAddress);
    const allRolesFiltered =
      hasRoleInTeam && (!selectedTeamId || selectedTeamId === Id.RootDomain)
        ? allRoles
        : allRoles?.filter(
            (role) => role !== ColonyRole.Root && role !== ColonyRole.Recovery,
          );
    const permissionRole =
      hasRoleInTeam && allRolesFiltered?.length
        ? getRole(allRolesFiltered)
        : undefined;
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
      reputation: selectedTeamId
        ? reputation?.items?.find((item) => {
            const { domain } = item || {};
            return domain?.nativeId === selectedTeamId;
          })?.reputationPercentage
        : colonyReputationPercentage,
      role: permissionRole,
    };
  });
};
