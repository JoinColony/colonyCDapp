import { useTransformer } from '~hooks';
import { getUserRolesForDomain } from '~redux/transformers';
import { Colony } from '~types';

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
