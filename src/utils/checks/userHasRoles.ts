import { ColonyRole, Id } from '@colony/colony-js';

import { getUserRolesForDomain } from '~transformers/index.ts';
import { type Colony } from '~types/graphql.ts';
import { extractColonyRoles } from '~utils/colonyRoles.ts';

export const userHasRole = (userRoles: ColonyRole[], role: ColonyRole) =>
  userRoles.includes(role);

export const addressHasRoles = ({
  requiredRolesDomain,
  colony,
  address,
  requiredRoles,
  isMultiSig = false,
}: {
  requiredRolesDomain: number;
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

  const excludeInherited = requiredRolesDomain && actionRequiresMultipleRoles;

  const userDomainRoles = getUserRolesForDomain({
    colonyRoles: extractColonyRoles(colony.roles),
    userAddress: address || '',
    domainId: requiredRolesDomain,
    constraint: excludeInherited ? 'excludeInheritedRoles' : null,
  });

  const userMultiSigDomainRoles = getUserRolesForDomain({
    colonyRoles: extractColonyRoles(colony.roles),
    userAddress: address || '',
    domainId: requiredRolesDomain,
    constraint: excludeInherited ? 'excludeInheritedRoles' : null,
    isMultiSig: true,
  });

  // Check if any of the requiredRoles arrays match
  const domainRolesIncludeRequiredRoles = rolesArray.some((roles) => {
    return roles.every((role) => {
      if (isMultiSig) {
        return userMultiSigDomainRoles.includes(role);
      }
      return userDomainRoles.includes(role);
    });
  });

  if (domainRolesIncludeRequiredRoles) {
    return true;
  }

  if (
    !actionRequiresMultipleRoles ||
    (actionRequiresMultipleRoles && requiredRolesDomain === Id.RootDomain)
  ) {
    return false;
  }

  // Only actions requiring multiple roles should get here
  // We excluded inherited roles in the above functions as all roles need to be in the same domain
  // Is there wasn't a match in the createdIn domain
  // We can check for an exact match in the root domain
  const userDomainRootRoles = getUserRolesForDomain({
    colonyRoles: extractColonyRoles(colony.roles),
    userAddress: address || '',
    domainId: Id.RootDomain,
  });

  const userMultiSigDomainRootRoles = getUserRolesForDomain({
    colonyRoles: extractColonyRoles(colony.roles),
    userAddress: address || '',
    domainId: requiredRolesDomain,
    isMultiSig: true,
  });

  // Check if any of the requiredRoles arrays match root roles
  return rolesArray.some((roles) => {
    return roles.every((role) => {
      if (isMultiSig) {
        return userMultiSigDomainRootRoles.includes(role);
      }
      return userDomainRootRoles.includes(role);
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
