import { Id } from '@colony/colony-js';

import { getRole } from '~constants/permissions.ts';
import { type ColonyContributorFragment, type ColonyFragment } from '~gql';
import {
  getHighestTierRoleForUser,
  getUserRolesForDomain,
} from '~transformers';

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

    const domainRoles = getUserRolesForDomain({
      colony,
      userAddress: contributorAddress,
      domainId: selectedTeamId || Id.RootDomain,
      intersectingRoles: true,
    });

    const domainRolesMeta = domainRoles.length
      ? getRole(domainRoles)
      : undefined;

    const domainRolesWithoutInherited = getUserRolesForDomain({
      colony,
      userAddress: contributorAddress,
      domainId: selectedTeamId || Id.RootDomain,
      excludeInherited: true,
    });

    const highestTierRole = getHighestTierRoleForUser(
      colony,
      contributorAddress,
    );

    const highestTierRoleMeta = highestTierRole
      ? getRole(highestTierRole)
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
      role: isAllTeamsSelected ? highestTierRoleMeta : domainRolesMeta,
      isRoleInherited:
        isAllTeamsSelected || selectedTeamId === Id.RootDomain
          ? false
          : !domainRolesWithoutInherited.length,
      contributorType: type ?? undefined,
    };
  });
};
