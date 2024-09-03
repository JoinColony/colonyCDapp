import { type ColonyRole, Id } from '@colony/colony-js';
import intersection from 'lodash/intersection';

import { type ColonyFragment, type ColonyRoleFragment } from '~gql';
import { type Address } from '~types/index.ts';
import { notUndefined, True } from '~utils/arrays/index.ts';

// export const getRolesForUserAndDomain = (
//   roles: ColonyRoles,
//   userAddress: Address,
//   domainId: number,
// ): ColonyRole[] => {
//   const userRoles = roles.find(({ address }) => address === userAddress);
//   if (!userRoles) return [];
//   const domainRoles = userRoles.domains.find(
//     ({ domainId: ethDomainId }) => ethDomainId === domainId,
//   );
//   return domainRoles ? (domainRoles.roles as ColonyRole[]) : [];
// };

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

export const convertRolesToArray = (
  rolesInDomain?: Pick<
    ColonyRoleFragment,
    'role_0' | 'role_1' | 'role_2' | 'role_3' | 'role_5' | 'role_6'
  > | null,
) =>
  Object.keys(rolesInDomain || {})
    .filter((keyName) => keyName.startsWith('role_'))
    .map((keyName) =>
      rolesInDomain?.[keyName]
        ? parseInt(keyName.slice(keyName.indexOf('_') + 1), 10)
        : undefined,
    )
    .filter(notUndefined);

export const getAllUserRoles = (
  colonyRoles: ColonyRoleFragment[],
  userAddress: Address | undefined,
  isMultiSig = false,
): ColonyRole[] => {
  if (!userAddress) return [];

  const userRolesInAnyDomain = colonyRoles.find((domainRole) => {
    const isMatchingUser = domainRole?.targetAddress === userAddress;
    const isMatchingMultiSig = isMultiSig === !!domainRole?.isMultiSig;

    return isMatchingUser && isMatchingMultiSig;
  });

  return Array.from(new Set([...convertRolesToArray(userRolesInAnyDomain)]));
};

export const getUserRolesForDomain = ({
  colonyRoles,
  userAddress,
  domainId,
  excludeInherited = false,
  intersectingRoles = false,
  isMultiSig = false,
}: {
  colonyRoles: ColonyRoleFragment[];
  userAddress: Address;
  domainId?: number;
  excludeInherited?: boolean;
  intersectingRoles?: boolean;
  isMultiSig?: boolean;
}): ColonyRole[] => {
  if (!domainId) {
    return getAllUserRoles(colonyRoles, userAddress, isMultiSig);
  }
  const getUserRolesInDomain = (targetDomainId: number) =>
    colonyRoles.find((domainRole) => {
      const isMatchingDomain = domainRole?.domain?.nativeId === targetDomainId;
      const isMatchingUser = domainRole?.targetAddress === userAddress;
      const isMatchingMultiSig = isMultiSig === !!domainRole?.isMultiSig;

      return isMatchingDomain && isMatchingUser && isMatchingMultiSig;
    });

  const userRolesInAnyDomain = getUserRolesInDomain(domainId);
  const userRolesInRootDomain = getUserRolesInDomain(Id.RootDomain);

  if (excludeInherited && userRolesInAnyDomain) {
    return convertRolesToArray(userRolesInAnyDomain);
  }

  if (intersectingRoles && userRolesInAnyDomain && userRolesInRootDomain) {
    return intersection(
      convertRolesToArray(userRolesInAnyDomain),
      convertRolesToArray(userRolesInRootDomain),
    );
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

/**
 * If a user has a role in the root domain, it returns the user's roles set for that domain
 * Otherwise, it checks the user's roles set in each subdomain and returns highest tier role set
 * @param colony
 * @param userAddress
 * @returns ColonyRole[] | null
 */
export const getHighestTierRoleForUser = (
  colony: ColonyFragment,
  userAddress: Address | undefined,
  isMultiSig = false,
): ColonyRole[] | null => {
  if (!userAddress) return [];

  const coloniesWhereUserHasARole = colony.roles?.items.filter(
    (domainRole) =>
      isMultiSig === !!domainRole?.isMultiSig &&
      domainRole?.targetAddress === userAddress &&
      Object.values(domainRole).find(True),
  );

  if (!coloniesWhereUserHasARole?.length) {
    return null;
  }

  const rootDomainRole = coloniesWhereUserHasARole?.find(
    (colonyWhereUserHasARole) =>
      colonyWhereUserHasARole?.domain.nativeId === Id.RootDomain,
  );

  if (rootDomainRole) {
    return convertRolesToArray(rootDomainRole);
  }

  const result = coloniesWhereUserHasARole.reduce(
    (maxObj, currentObj) =>
      Object.values(currentObj ?? {}).filter(True).length >
      Object.values(maxObj ?? {}).filter(True).length
        ? currentObj
        : maxObj,
    {} as ColonyRoleFragment,
  );

  return convertRolesToArray(result);
};
