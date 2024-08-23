import { Id } from '@colony/colony-js';

import {
  getInheritedPermissions,
  getRole,
  type UserRoleMeta,
} from '~constants/permissions.ts';
import { type ColonyContributorFragment, type ColonyFragment } from '~gql';
import { getUserRolesForDomain } from '~transformers/index.ts';
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
    excludeInherited: true,
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

  // inheritedPermissions contains only a difference between parrent and current permissions
  // in case current role is higher inheritedPermissions.length would be 0
  if (inheritedPermissions.length > 0) {
    return { role: getRole(parentPermissions), isInherited: true };
  }

  if (currentTeamPermissions.length > 0) {
    return { role: getRole(currentTeamPermissions), isInherited: false };
  }

  return { role: undefined, isInherited: false };
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

    const { role: roleTest, isInherited: isRoleInherited } = getRoleInfo({
      colonyRoles,
      contributorAddress,
      selectedTeamId,
      isRootDomain,
      isMultiSig: false,
    });

    const { role: multiSigRole, isInherited: isMultiSigRoleInherited } =
      getRoleInfo({
        colonyRoles,
        contributorAddress,
        selectedTeamId,
        isRootDomain,
        isMultiSig: true,
      });

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
      role: roleTest,
      isRoleInherited,
      multiSigRole,
      isMultiSigRoleInherited,
      contributorType: type ?? undefined,
    };
  });
};
