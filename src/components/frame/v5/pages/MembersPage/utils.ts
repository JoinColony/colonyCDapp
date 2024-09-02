import { Id } from '@colony/colony-js';

import { getRole } from '~constants/permissions.ts';
import { type ColonyContributorFragment, type ColonyFragment } from '~gql';
import {
  getHighestTierRoleForUser,
  getUserRolesForDomain,
} from '~transformers';
import { extractColonyRoles } from '~utils/colonyRoles.ts';

import { type MemberItem } from './types.ts';

export const getMembersList = (
  members: ColonyContributorFragment[],
  selectedTeamId: number | undefined,
  colony: ColonyFragment,
): MemberItem[] => {
  const isAllTeamsSelected = selectedTeamId === undefined;
  const colonyRoles = extractColonyRoles(colony.roles);

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
      colonyRoles,
      userAddress: contributorAddress,
      domainId: selectedTeamId || Id.RootDomain,
      intersectingRoles: true,
    });

    const domainRolesMeta = domainRoles.length
      ? getRole(domainRoles)
      : undefined;

    const domainRolesWithoutInherited = getUserRolesForDomain({
      colonyRoles,
      userAddress: contributorAddress,
      domainId: selectedTeamId || Id.RootDomain,
      excludeInherited: true,
    });

    const highestTierRole = getHighestTierRoleForUser(
      colonyRoles,
      contributorAddress,
    );

    const highestTierRoleMeta = highestTierRole
      ? getRole(highestTierRole)
      : undefined;

    const teamReputationPercentage = reputation?.items?.find(
      (item) => item?.domain?.nativeId === selectedTeamId,
    )?.reputationPercentage;

    const domainMultiSigRoles = getUserRolesForDomain({
      colonyRoles,
      userAddress: contributorAddress,
      domainId: selectedTeamId || Id.RootDomain,
      intersectingRoles: true,
      isMultiSig: true,
    });

    const domainMultiSigRolesMeta = domainMultiSigRoles.length
      ? getRole(domainMultiSigRoles)
      : undefined;

    const domainMultiSigRolesWithoutInherited = getUserRolesForDomain({
      colonyRoles,
      userAddress: contributorAddress,
      domainId: selectedTeamId || Id.RootDomain,
      excludeInherited: true,
      isMultiSig: true,
    });

    const highestTierMultiSigRole = getHighestTierRoleForUser(
      colonyRoles,
      contributorAddress,
      true,
    );

    const highestTierMultiSigRoleMeta = highestTierMultiSigRole
      ? getRole(highestTierMultiSigRole, true)
      : undefined;

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
      multiSigRole: isAllTeamsSelected
        ? highestTierMultiSigRoleMeta
        : domainMultiSigRolesMeta,
      isMultiSigRoleInherited:
        isAllTeamsSelected || selectedTeamId === Id.RootDomain
          ? false
          : !domainMultiSigRolesWithoutInherited.length,
      contributorType: type ?? undefined,
    };
  });
};
