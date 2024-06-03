import { ColonyRole, Id } from '@colony/colony-js';

import { getRole } from '~constants/permissions.ts';
import { type ColonyContributorFragment, type ColonyFragment } from '~gql';
import { getAllUserRoles } from '~transformers/index.ts';
import { extractColonyRoles } from '~utils/colonyRoles.ts';

import { type MemberItem } from './types.ts';

export const getMembersList = (
  members: ColonyContributorFragment[],
  selectedTeamId: number | undefined,
  colony: ColonyFragment,
): MemberItem[] => {
  return members.map((contributor) => {
    const {
      contributorAddress,
      colonyReputationPercentage,
      user,
      isVerified,
      roles,
      reputation,
      type,
    } = contributor;
    const { items } = roles || {};
    const hasRoleInTeam = items?.some((item) => {
      const { domain } = item || {};

      return (
        domain?.nativeId === selectedTeamId ||
        domain?.nativeId === Id.RootDomain
      );
    });
    const allRoles = getAllUserRoles(
      extractColonyRoles(colony.roles),
      contributorAddress,
    );
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

    const allMultiSigRoles = getAllUserRoles(colony, contributorAddress, true);
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

    return {
      user,
      walletAddress: contributorAddress,
      isVerified,
      reputation: selectedTeamId
        ? reputation?.items?.find((item) => {
            const { domain } = item || {};
            return domain?.nativeId === selectedTeamId;
          })?.reputationPercentage
        : colonyReputationPercentage,
      role: permissionRole,
      multiSigRole: permissionMultiSigRole,
      contributorType: type ?? undefined,
    };
  });
};
