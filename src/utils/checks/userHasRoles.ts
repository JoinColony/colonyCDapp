import { ColonyRole } from '@colony/colony-js';

import { getUserRolesForDomain } from '~transformers/index.ts';
import { type Colony } from '~types/graphql.ts';

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
  requiredRoles: ColonyRole[];
  isMultiSig: boolean;
}) => {
  return requiredRolesDomains.every((domainId) => {
    const userDomainRoles = getUserRolesForDomain({
      colony,
      userAddress: address || '',
      domainId,
    });

    const userMultiSigDomainRoles = getUserRolesForDomain(
      colony,
      address || '',
      domainId,
      false,
      true,
    );

    return requiredRoles.every((role) => {
      return (
        userDomainRoles.includes(role) ||
        (isMultiSig && userMultiSigDomainRoles.includes(role))
      );
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
