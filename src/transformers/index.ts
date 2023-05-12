import { ColonyRole, ColonyRoles, Id } from '@colony/colony-js';
import { ColonyFragment, ColonyRoleFragment } from '~gql';

import { Address, Colony } from '~types';
import { notUndefined } from '~utils/arrays';

export const getRolesForUserAndDomain = (
  roles: ColonyRoles,
  userAddress: Address,
  domainId: number,
): ColonyRole[] => {
  const userRoles = roles.find(({ address }) => address === userAddress);
  if (!userRoles) return [];
  const domainRoles = userRoles.domains.find(
    ({ domainId: ethDomainId }) => ethDomainId === domainId,
  );
  return domainRoles ? (domainRoles.roles as ColonyRole[]) : [];
};

// const getRolesForUserAndParentDomains = (
//   colony,
//   userAddress: Address,
//   domainId: number,
//   roleSet = new Set<ColonyRole>(),
// ): ColonyRole[] => {
//   const domain = colony?.domains?.find(
//     ({ ethDomainId }) => ethDomainId === domainId,
//   );
//   if (!domain) return Array.from(roleSet);
//   const roles = getRolesForUserAndDomain(colony.roles, userAddress, domainId);
//   roles.forEach((role) => roleSet.add(role));
//   if (domain.ethParentDomainId) {
//     getRolesForUserAndParentDomains(
//       colony,
//       userAddress,
//       domain.ethParentDomainId,
//       roleSet,
//     );
//   }
//   return Array.from(roleSet);
// };

const convertRolesToArray = (rolesInDomain?: ColonyRoleFragment | null) =>
  Object.keys(rolesInDomain || {})
    .filter((keyName) => keyName.startsWith('role_'))
    .map((keyName) =>
      rolesInDomain?.[keyName]
        ? parseInt(keyName.slice(keyName.indexOf('_') + 1), 10)
        : undefined,
    )
    .filter(notUndefined);

export const getUserRolesForDomain = (
  colony: ColonyFragment,
  userAddress: Address,
  domainId: number,
  excludeInherited = false,
): ColonyRole[] => {
  if (!colony || !domainId || !userAddress) return [];

  const userRolesInAnyDomain = colony.roles?.items.find(
    (domainRole) =>
      domainRole?.domain?.nativeId === domainId &&
      domainRole?.targetAddress === userAddress,
  );
  const userRolesInRootDomain = colony.roles?.items.find(
    (domainRole) =>
      domainRole?.domain?.nativeId === Id.RootDomain &&
      domainRole?.targetAddress === userAddress,
  );

  if (excludeInherited && userRolesInAnyDomain) {
    return convertRolesToArray(userRolesInAnyDomain);
  }

  if (!excludeInherited && (userRolesInAnyDomain || userRolesInRootDomain)) {
    return Array.from(
      new Set([
        ...convertRolesToArray(userRolesInAnyDomain),
        ...convertRolesToArray(userRolesInRootDomain),
      ]),
    );
  }

  return [];
};

export const getAllUserRoles = (
  colony: Colony | undefined,
  userAddress: Address | undefined,
): ColonyRole[] => {
  if (!colony || !userAddress) return [] as ColonyRole[];
  return [0, 1, 2, 3, 5, 6];
  // const userRoles = colony.roles.find(({ address }) => address === userAddress);
  // if (!userRoles) return [] as ColonyRole[];
  // return Array.from(
  //   userRoles.domains.reduce((allUserRoles, domain) => {
  //     domain.roles.forEach((role) => allUserRoles.add(role));
  //     return allUserRoles;
  //   }, new Set<ColonyRole>()),
  // );
};
