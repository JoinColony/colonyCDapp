import { ColonyRole, Id } from '@colony/colony-js';

import { getRole } from '~constants/permissions.ts';
import { type ColonyContributorFragment, type ColonyFragment } from '~gql';
import { getAllUserRoles } from '~transformers';

import { type MemberItem } from './types.ts';

export const getMembersList = (
  members: ColonyContributorFragment[],
  selectedTeamId: number | undefined,
  colony: ColonyFragment,
): MemberItem[] => {
  const isAllTeamsSelected = selectedTeamId === undefined;

  return members.map((contributor) => {
    const {
      contributorAddress,
      colonyReputationPercentage,
      user,
      isVerified,
      roles,
      reputation,
      type,
      hasPermissions,
    } = contributor;

    const hasRoleInTeam = roles?.items?.some((item) => {
      const domainId = item?.domain?.nativeId;

      return isAllTeamsSelected
        ? hasPermissions
        : domainId === selectedTeamId || domainId === Id.RootDomain;
    });

    const allRoles = getAllUserRoles(colony, contributorAddress);

    const filteredRoles =
      hasRoleInTeam && (!selectedTeamId || selectedTeamId === Id.RootDomain)
        ? allRoles
        : allRoles?.filter(
            (role) => role !== ColonyRole.Root && role !== ColonyRole.Recovery,
          );

    const permissionRole =
      hasRoleInTeam && filteredRoles?.length
        ? getRole(filteredRoles)
        : undefined;

    const teamReputationPercentage = reputation?.items?.find(
      (item) => item?.domain?.nativeId === selectedTeamId,
    )?.reputationPercentage;

    return {
      user,
      walletAddress: contributorAddress,
      isVerified,
      reputation: isAllTeamsSelected
        ? colonyReputationPercentage
        : teamReputationPercentage,
      role: permissionRole,
      contributorType: type ?? undefined,
    };
  });
};
