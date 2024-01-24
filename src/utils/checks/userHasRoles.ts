import { ColonyRole } from '@colony/colony-js';

import { getUserRolesForDomain } from '~transformers';
import { Colony } from '~types/graphql';

export const userHasRole = (userRoles: ColonyRole[], role: ColonyRole) =>
  userRoles.includes(role);

export const addressHasRoles = ({
  requiredRolesDomains,
  colony,
  address,
  requiredRoles,
}: {
  requiredRolesDomains: number[];
  colony: Colony;
  address: string;
  requiredRoles: ColonyRole[];
}) => {
  return requiredRolesDomains.every((domainId) => {
    const userDomainRoles = getUserRolesForDomain(
      colony,
      address || '',
      domainId,
    );

    return requiredRoles.every((role) => userHasRole(userDomainRoles, role));
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
