import { ColonyRole, Id } from '@colony/colony-js';
import { useFormContext } from 'react-hook-form';
import { useMemo } from 'react';

import {
  EnabledExtensionData,
  useActionDialogStatus,
  useAppContext,
} from '~hooks';
import { Address, Colony } from '~types';
import { ColonyFragment } from '~gql';
import { isEqual, sortBy } from '~utils/lodash';
import { notNull, notUndefined } from '~utils/arrays';
import { getUserRolesForDomain } from '~transformers';

import { availableRoles } from './constants';

export const getPermissionManagementDialogPayload = ({
  roles,
  user,
  domainId,
  annotationMessage,
  motionDomainId,
}) => ({
  domainId,
  userAddress: user.walletAddress,
  roles: availableRoles
    .map((role) => role.toString())
    .reduce(
      (acc, role) => ({
        ...acc,
        [role]: roles.includes(role),
      }),
      {},
    ),
  annotationMessage,
  motionDomainId: parseInt(motionDomainId, 10),
});

export const useSelectedUserRoles = (
  colony: ColonyFragment,
  selectedUserAddress: Address,
) =>
  useMemo(() => {
    const formattedUserRoles = {
      direct: {},
      inherited: {},
    };
    if (colony?.roles && colony?.domains && selectedUserAddress) {
      const allExistingUserRoles = colony.roles.items.filter(
        (role) => role?.targetAddress === selectedUserAddress,
      );
      colony.domains.items.map((domain) => {
        /*
         * @NOTE Re-filtering
         * Preffer filtering again, as opposed to iterating over the full array each time
         * This will still iterate, just that it's going to be over a limited size array
         *
         * @NOTE Inheritence
         * Permissions are inherited from parent down to all childen (and their children)
         * Since we only have one current parrent in the CDapp, meaning "Root", we only
         * have to account for it.
         * However this will need to be refactored once we move to multi level domains
         */
        const specificDomainUserRoles = allExistingUserRoles.filter((role) => {
          const rolesInRoot = role?.domain?.nativeId === Id.RootDomain;
          const rolesInSubdomain = role?.domain?.nativeId === domain?.nativeId;
          if (domain?.nativeId === Id.RootDomain) {
            return rolesInRoot;
          }
          return rolesInRoot || rolesInSubdomain;
        });
        const currentDomainId = domain?.nativeId || 'unknownDomainId';
        return specificDomainUserRoles.map((role) => {
          let roleType = 'direct';
          // Inherited
          if (currentDomainId !== role?.domain?.nativeId) {
            roleType = 'inherited';
          }
          /*
           * I think this rule is stupid. I think I'm going to disable it.
           * We need a forum to do this, I don't want to feel that I'm making
           * decisions like this unanimous
           */
          // eslint-disable-next-line no-multi-assign
          const currentDomainRoles = (formattedUserRoles[roleType][
            currentDomainId
          ] = {
            ...formattedUserRoles[roleType][currentDomainId],
            0: role?.role_0, // recovery
            1: role?.role_1, // root
            2: role?.role_2, // arbitration
            3: role?.role_3, // architecture
            // role_4 architecture subdomain is deprecated
            5: role?.role_5, // funding
            6: role?.role_6, // administrator
          });
          return currentDomainRoles;
        });
      });
      return formattedUserRoles;
    }
    return formattedUserRoles;
  }, [colony, selectedUserAddress]);

export const usePermissionManagementDialogStatus = (
  colony: Colony,
  requiredRoles: ColonyRole[],
  enabledExtensionData: EnabledExtensionData,
) => {
  const { watch } = useFormContext();
  const { domainId, roles, user: selectedUser } = watch();

  const {
    userHasPermission,
    disabledSubmit: defaultDisabledSubmit,
    disabledInput,
    canCreateMotion,
    canOnlyForceAction,
  } = useActionDialogStatus(
    colony,
    requiredRoles,
    [domainId],
    enabledExtensionData,
  );

  const userDirectAndInheritedRoles = getUserRolesForDomain(
    colony,
    selectedUser?.walletAddress || '',
    domainId,
  );

  return {
    userHasPermission,
    disabledInput,
    disabledSubmit:
      defaultDisabledSubmit ||
      isEqual(
        sortBy(roles),
        sortBy(userDirectAndInheritedRoles.map((role) => role.toString())),
      ),
    canCreateMotion,
    canOnlyForceAction,
  };
};

// Check which roles the current user is allowed to set in this domain
export const useCanRoleBeSet = (colony: Colony) => {
  const { watch } = useFormContext();
  const domainId = watch('domainId');
  const { user: currentUser } = useAppContext();

  const currentUserRoles = useSelectedUserRoles(
    colony,
    currentUser?.walletAddress || '',
  );

  const checkUserRole = (role: ColonyRole, inheritedRole = false) => {
    return !!currentUserRoles[inheritedRole ? 'inherited' : 'direct']?.[
      domainId
    ]?.[role];
  };

  const isCurrentDomainRoot = domainId === Id.RootDomain;
  const hasInheritedRoot = checkUserRole(ColonyRole.Root, true);
  const hasDirectdRoot = checkUserRole(ColonyRole.Root);
  const hasInheriteddArchitecture = checkUserRole(
    ColonyRole.Architecture,
    true,
  );
  const hasDirectdArchitecture = checkUserRole(ColonyRole.Architecture);
  const hasRoot = hasInheritedRoot || hasDirectdRoot;
  const hasArchitecture = hasInheriteddArchitecture || hasDirectdArchitecture;
  const hasUltimateRoot = isCurrentDomainRoot && hasRoot;
  const canAssignRole = hasRoot || hasArchitecture;

  /*
   * @NOTE That this is most likely bugged
   * For now, we're kicking the can down the road, but this needs a full do-over
   * both structurally, and logically, when we get to do the new UI
   */
  const canRoleBeSet = (role: ColonyRole) => {
    switch (role) {
      case ColonyRole.Arbitration:
        return canAssignRole;

      // Can only be set by root and in root domain (and only unset if other root accounts exist)
      case ColonyRole.Root:
      case ColonyRole.Recovery:
        return hasUltimateRoot;

      case ColonyRole.Administration:
      case ColonyRole.Funding:
        return canAssignRole;

      // Can be set if root domain and has root OR has architecture in parent
      case ColonyRole.Architecture:
        return canAssignRole;

      default:
        return false;
    }
  };

  return canRoleBeSet;
};

export const formatRolesForForm = (
  userRoles: Record<
    string,
    Record<string, Record<string, boolean | undefined | null>>
  >,
  domainId: number,
) => {
  if (userRoles) {
    // @NOTE They only matter for subdomains and will never exist for Root
    const {
      0: inheritedRecoveryRole,
      1: inheritedRootRole,
      2: inheritedArbitrationRole,
      3: inheritedArchitectureRole,
      // architecture subdomain missing since it's deprecated
      5: inheritedFundingRole,
      6: inheritedAdministrationRole,
    } = userRoles.inherited?.[domainId] || {};

    const {
      0: directRecoveryRole,
      1: directRootRole,
      2: directArbitrationRole,
      3: directArchitectureRole,
      // architecture subdomain missing since it's deprecated
      5: directFundingRole,
      6: directAdministrationRole,
    } = userRoles.direct?.[domainId] || {};

    // @NOTE Different order of roles, since it's required by the UI
    const formRolesMap = [
      (inheritedRootRole || directRootRole) && '1',
      (inheritedAdministrationRole || directAdministrationRole) && '6',
      (inheritedArchitectureRole || directArchitectureRole) && '3',
      (inheritedFundingRole || directFundingRole) && '5',
      (inheritedRecoveryRole || directRecoveryRole) && '0',
      (inheritedArbitrationRole || directArbitrationRole) && '2',
    ]
      .filter(notNull)
      .filter(notUndefined);
    return formRolesMap;
  }
  return [];
};
