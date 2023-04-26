import { ColonyRole, Id } from '@colony/colony-js';
import { useFormContext } from 'react-hook-form';
import { useMemo } from 'react';

import {
  EnabledExtensionData,
  useActionDialogStatus,
  useAppContext,
  useTransformer,
} from '~hooks';
import { getAllRootAccounts } from '~redux/transformers';
import { Address, Colony } from '~types';
import { isEqual, sortBy } from '~utils/lodash';
import { notNull, notUndefined } from '~utils/arrays';

import { availableRoles } from './constants';
import { ColonyFragment } from '~gql';

export const getPermissionManagementDialogPayload = ({
  roles,
  user,
  domainId,
  annotationMessage,
  motionDomainId,
}) => ({
  domainId,
  userAddress: user.profile.walletAddress,
  roles: availableRoles.reduce(
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
  defaultSelectedUserRoles: string[],
) => {
  const { watch } = useFormContext();
  const { domainId, roles } = watch();

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

  return {
    userHasPermission,
    disabledInput,
    disabledSubmit:
      defaultDisabledSubmit ||
      isEqual(sortBy(roles), sortBy(defaultSelectedUserRoles)),
    canCreateMotion,
    canOnlyForceAction,
  };
};

// Check which roles the current user is allowed to set in this domain
export const useCanRoleBeSet = (
  colony: Colony,
  selectedUserDirectRoles: ColonyRole[],
) => {
  const { watch } = useFormContext();
  const domainId = watch('domainId');
  const { user: currentUser } = useAppContext();
  const currentUserRoles = useTransformer(getUserRolesForDomain, [
    colony,
    currentUser?.walletAddress,
    domainId,
  ]);

  const currentUserRolesInRoot = useTransformer(getUserRolesForDomain, [
    colony,
    currentUser?.walletAddress,
    Id.RootDomain,
  ]);

  const rootAccounts = useTransformer(getAllRootAccounts, [
    /* colony */
  ]);
  const canSetPermissionsInRoot =
    domainId === Id.RootDomain &&
    currentUserRoles.includes(ColonyRole.Root) &&
    (!selectedUserDirectRoles.includes(ColonyRole.Root) ||
      rootAccounts.length > 1);
  const hasRoot = currentUserRolesInRoot.includes(ColonyRole.Root);
  const hasArchitectureInRoot = currentUserRolesInRoot.includes(
    ColonyRole.Architecture,
  );
  const canRoleBeSet = (role: ColonyRole) => {
    switch (role) {
      case ColonyRole.Arbitration:
        return true;

      // Can only be set by root and in root domain (and only unset if other root accounts exist)
      case ColonyRole.Root:
      case ColonyRole.Recovery:
        return canSetPermissionsInRoot;

      // Must be root for these
      case ColonyRole.Administration:
      case ColonyRole.Funding:
        return hasArchitectureInRoot;

      // Can be set if root domain and has root OR has architecture in parent
      case ColonyRole.Architecture:
        return (domainId === Id.RootDomain && hasRoot) || hasArchitectureInRoot;

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
