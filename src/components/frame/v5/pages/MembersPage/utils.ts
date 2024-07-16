import { ColonyRole, Id } from '@colony/colony-js';

import { getRole } from '~constants/permissions.ts';
import { type ColonyContributorFragment, type ColonyFragment } from '~gql';
import { getUserRolesForDomain } from '~transformers';

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
      reputation,
      type,
    } = contributor;

    const permissionsInTeam = getUserRolesForDomain({
      colony,
      userAddress: contributorAddress,
      domainId: selectedTeamId || Id.RootDomain,
      excludeInherited: true,
    });

    const allPermissions = getUserRolesForDomain({
      colony,
      userAddress: contributorAddress,
      domainId: selectedTeamId || Id.RootDomain,
    });

    const teamReputationPercentage = reputation?.items?.find(
      (item) => item?.domain?.nativeId === selectedTeamId,
    )?.reputationPercentage;

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
      contributorType: type ?? undefined,
    };
  });
};
