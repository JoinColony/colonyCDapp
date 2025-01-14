import { ColonyRole, Id } from '@colony/colony-js';

import {
  getInheritedPermissions,
  getRole,
  type UserRoleMeta,
} from '~constants/permissions.ts';
import { type ColonyContributorFragment, type ColonyFragment } from '~gql';
import { getContributorBreakdown } from '~hooks/members/useContributorBreakdown.ts';
import {
  getHighestTierRoleForUser,
  getUserRolesForDomain,
} from '~transformers/index.ts';
import { notNull } from '~utils/arrays/index.ts';
import { extractColonyRoles } from '~utils/colonyRoles.ts';

import { type MemberItem } from './types.ts';

interface RoleInfo {
  role: UserRoleMeta | undefined;
  isInherited: boolean;
}

interface GetRoleInfoParams {
  colonyRoles: ReturnType<typeof extractColonyRoles>;
  contributorAddress: string;
  selectedTeamId: number | undefined;
  isRootDomain: boolean;
  isMultiSig: boolean;
}

const getRoleInfo = ({
  colonyRoles,
  contributorAddress,
  selectedTeamId,
  isRootDomain,
  isMultiSig,
}: GetRoleInfoParams): RoleInfo => {
  const currentTeamPermissions = getUserRolesForDomain({
    colonyRoles,
    userAddress: contributorAddress,
    domainId: selectedTeamId || Id.RootDomain,
    constraint: 'excludeInheritedRoles',
    isMultiSig,
  });

  const parentPermissions = getUserRolesForDomain({
    colonyRoles,
    userAddress: contributorAddress,
    domainId: Id.RootDomain,
    isMultiSig,
  });

  const inheritedPermissions = getInheritedPermissions({
    parentPermissions,
    currentPermissions: currentTeamPermissions,
    isRootDomain,
  });
  if (!inheritedPermissions.length && !currentTeamPermissions.length) {
    return { role: undefined, isInherited: false };
  }

  let mergedPermissions = [
    ...new Set([...parentPermissions, ...currentTeamPermissions]),
  ];

  if (!isRootDomain) {
    mergedPermissions = mergedPermissions.filter(
      (permission) =>
        permission !== ColonyRole.Root && permission !== ColonyRole.Recovery,
    );
  }
  return {
    role: getRole(mergedPermissions),
    isInherited: inheritedPermissions.length > 0,
  };
};

export const getHighestTierRoleMeta = ({
  colonyRoles,
  contributorAddress,
  isMultiSig = false,
}) => {
  const highestTierRole = getHighestTierRoleForUser(
    colonyRoles,
    contributorAddress,
    isMultiSig,
  );
  return highestTierRole ? getRole(highestTierRole) : undefined;
};

export const getMembersList = (
  members: ColonyContributorFragment[],
  selectedTeamId: number | undefined,
  colony: ColonyFragment,
): MemberItem[] => {
  const isAllTeamsSelected = selectedTeamId === undefined;
  const isRootDomain = selectedTeamId === Id.RootDomain;
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

    const { domains: colonyDomains } = colony;

    const domains = getContributorBreakdown(
      colonyDomains?.items.filter(notNull) || [],
      contributor,
    );

    const { role: domainRolesMeta, isInherited: isRoleInherited } = getRoleInfo(
      {
        colonyRoles,
        contributorAddress,
        selectedTeamId,
        isRootDomain,
        isMultiSig: false,
      },
    );

    const highestTierRoleMeta = getHighestTierRoleMeta({
      colonyRoles,
      contributorAddress,
    });

    const {
      role: domainMultiSigRolesMeta,
      isInherited: isMultiSigRoleInherited,
    } = getRoleInfo({
      colonyRoles,
      contributorAddress,
      selectedTeamId,
      isRootDomain,
      isMultiSig: true,
    });

    const highestTierMultiSigRoleMeta = getHighestTierRoleMeta({
      colonyRoles,
      contributorAddress,
      isMultiSig: true,
    });

    const teamReputationPercentage = reputation?.items?.find(
      (item) => item?.domain?.nativeId === selectedTeamId,
    )?.reputationPercentage;

    return {
      user,
      domains,
      walletAddress: contributorAddress,
      isVerified,
      reputation: isAllTeamsSelected
        ? colonyReputationPercentage
        : teamReputationPercentage,
      role: isAllTeamsSelected ? highestTierRoleMeta : domainRolesMeta,
      isRoleInherited,
      multiSigRole: isAllTeamsSelected
        ? highestTierMultiSigRoleMeta
        : domainMultiSigRolesMeta,
      isMultiSigRoleInherited,
      contributorType: type ?? undefined,
    };
  });
};
