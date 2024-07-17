import { ColonyRole } from '@colony/colony-js';

import { getUserRolesForDomain } from '~transformers/index.ts';
import { type Colony } from '~types/graphql.ts';
import { extractColonyRoles } from '~utils/colonyRoles.ts';

export const userHasRole = (userRoles: ColonyRole[], role: ColonyRole) =>
  userRoles.includes(role);

export const addressHasRoles = ({
  requiredRolesDomains,
  colony,
  address,
  requiredRoles,
  isMultiSig = false,
}: {
  requiredRolesDomains: number[];
  colony: Colony;
  address: string;
  requiredRoles: ColonyRole[] | ColonyRole[][];
  isMultiSig?: boolean;
}) => {
  // Convert requiredRoles to an array of arrays if it's not already
  const rolesArray = Array.isArray(requiredRoles[0])
    ? (requiredRoles as ColonyRole[][])
    : [requiredRoles as ColonyRole[]];

  // If an action requires multiple roles, all the roles must be in the same domain
  const actionRequiresMultipleRoles = rolesArray.some((roleArray) => {
    if (roleArray.length > 1) {
      return true;
    }
    return false;
  });

  return requiredRolesDomains.every((domainId) => {
    const userDomainRoles = getUserRolesForDomain({
      colonyRoles: extractColonyRoles(colony.roles),
      userAddress: address || '',
      domainId,
      excludeInherited: domainId ? actionRequiresMultipleRoles : false,
    });

    const userMultiSigDomainRoles = getUserRolesForDomain({
      colonyRoles: extractColonyRoles(colony.roles),
      userAddress: address || '',
      domainId,
      excludeInherited: domainId ? actionRequiresMultipleRoles : false,
      isMultiSig: true,
    });

    // Check if any of the requiredRoles arrays match
    return rolesArray.some((roles) => {
      return roles.every((role) => {
        if (isMultiSig) {
          return userMultiSigDomainRoles.includes(role);
        }
        return userDomainRoles.includes(role);
      });
    });
  });
};

export const canEnterRecoveryMode = (userRoles: ColonyRole[]) =>
  userHasRole(userRoles, ColonyRole.Recovery);

export const canAdminister = (userRoles: ColonyRole[]) =>
  userHasRole(userRoles, ColonyRole.Administration);

export const canFund = (userRoles: ColonyRole[]) =>
  userHasRole(userRoles, ColonyRole.Funding);

export const hasRoot = (userRoles: ColonyRole[]) =>
  userHasRole(userRoles, ColonyRole.Root);

export const canArchitect = (userRoles: ColonyRole[]) =>
  userHasRole(userRoles, ColonyRole.Architecture);
