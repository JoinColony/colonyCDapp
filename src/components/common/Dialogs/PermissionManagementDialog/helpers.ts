import { ColonyRole, Id } from '@colony/colony-js';
import { useFormContext } from 'react-hook-form';

import {
  EnabledExtensionData,
  useActionDialogStatus,
  useAppContext,
  useTransformer,
} from '~hooks';
import { getAllRootAccounts } from '~redux/transformers';
import { Address, Colony } from '~types';
import { isEqual, sortBy } from '~utils/lodash';

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
) => {
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
          recoveryRole: role?.role_0,
          rootRole: role?.role_1,
          arbitrationRole: role?.role_2,
          architectureRole: role?.role_3,
          fundingRole: role?.role_5,
          administrationRole: role?.role_6,
        });
        return currentDomainRoles;
      });
    });
    return formattedUserRoles;
  }
  return formattedUserRoles;
};

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
