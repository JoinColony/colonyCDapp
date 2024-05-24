import { ColonyRole, Id } from '@colony/colony-js';

import { getRole } from '~constants/permissions.ts';
import { type ColonyContributorFragment, type ColonyFragment } from '~gql';
import { getAllUserRoles, getUserRolesForDomain } from '~transformers/index.ts';
import { extractColonyRoles } from '~utils/colonyRoles.ts';

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

    const permissionsInTeam = getUserRolesForDomain({
      colonyRoles: extractColonyRoles(colony.roles),
      userAddress: contributorAddress,
      domainId: selectedTeamId || Id.RootDomain,
      excludeInherited: true,
    });

    const allPermissions = getUserRolesForDomain({
      colonyRoles: extractColonyRoles(colony.roles),
      userAddress: contributorAddress,
      domainId: selectedTeamId || Id.RootDomain,
    });

    const teamReputationPercentage = reputation?.items?.find(
      (item) => item?.domain?.nativeId === selectedTeamId,
    )?.reputationPercentage;
    const allMultiSigRoles = getAllUserRoles(
      extractColonyRoles(colony.roles),
      contributorAddress,
      true,
    );
    const allMultiSigRolesFiltered =
      hasRoleInTeam && (!selectedTeamId || selectedTeamId === Id.RootDomain)
        ? allMultiSigRoles
        : allMultiSigRoles?.filter(
            (role) => role !== ColonyRole.Root && role !== ColonyRole.Recovery,
          );
    const permissionMultiSigRole =
      hasRoleInTeam && allMultiSigRolesFiltered?.length
        ? getRole(allMultiSigRolesFiltered)
        : undefined;

    const allMultiSigRoles = getAllUserRoles(
      extractColonyRoles(colony.roles),
      contributorAddress,
      true,
    );
    const allMultiSigRolesFiltered =
      hasRoleInTeam && (!selectedTeamId || selectedTeamId === Id.RootDomain)
        ? allMultiSigRoles
        : allMultiSigRoles?.filter(
            (role) => role !== ColonyRole.Root && role !== ColonyRole.Recovery,
          );
    const permissionMultiSigRole =
      hasRoleInTeam && allMultiSigRolesFiltered?.length
        ? getRole(allMultiSigRolesFiltered)
        : undefined;

    const parentRole = allPermissions.length
      ? getRole(
          allPermissions.filter((role) =>
            selectedTeamId !== Id.RootDomain && !isAllTeamsSelected
              ? role !== ColonyRole.Root && role !== ColonyRole.Recovery
              : true,
          ),
        )
      : undefined;

    const roleTest = permissionsInTeam.length
      ? getRole(permissionsInTeam)
      : parentRole;

    return {
      user,
      walletAddress: contributorAddress,
      isVerified,
      reputation: isAllTeamsSelected
        ? colonyReputationPercentage
        : teamReputationPercentage,
      role: roleTest,
      isRoleInherited: !permissionsInTeam.length && !!roleTest,
      multiSigRole: permissionMultiSigRole,
      contributorType: type ?? undefined,
    };
  });
};
