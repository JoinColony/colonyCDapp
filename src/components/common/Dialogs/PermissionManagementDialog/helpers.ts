import { ColonyRole, Id } from '@colony/colony-js';
import { useFormContext } from 'react-hook-form';

import {
  EnabledExtensionData,
  useActionDialogStatus,
  useAppContext,
  useTransformer,
} from '~hooks';
import { getAllRootAccounts, getUserRolesForDomain } from '~redux/transformers';
import { Colony } from '~types';
import { isEqual, sortBy } from '~utils/lodash';

import { availableRoles } from './constants';

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
  colony: Colony,
  walletAddress: string | undefined,
  domainId: number,
) => {
  const userDirectRoles = useTransformer(getUserRolesForDomain, [
    colony,
    walletAddress,
    domainId,
    // true,
  ]);

  const userInheritedRoles = useTransformer(getUserRolesForDomain, [
    colony,
    walletAddress,
    domainId,
  ]);

  return {
    inheritedRoles: userInheritedRoles,
    directRoles: userDirectRoles,
  };
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

  const rootAccounts = useTransformer(getAllRootAccounts, [colony]);
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
