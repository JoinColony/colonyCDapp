import { type ColonyRole, Id } from '@colony/colony-js';

import { type ColonyFragment, type ColonyRoleFragment } from '~gql';
import { type Address } from '~types/index.ts';
import { notUndefined } from '~utils/arrays/index.ts';

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

export const getUserRolesForDomain = ({
  colony,
  userAddress,
  domainId,
  excludeInherited = false,
}: {
  colony: ColonyFragment;
  userAddress: Address;
  domainId: number;
  excludeInherited?: boolean;
}): ColonyRole[] => {
  const userRolesInAnyDomain = colony.roles?.items.find(
    (domainRole) =>
      domainRole?.domain?.nativeId === domainId &&
      domainRole?.targetAddress === userAddress &&
      !domainRole.isMultiSig,
  );

  const userRolesInRootDomain = colony.roles?.items.find(
    (domainRole) =>
      domainRole?.domain?.nativeId === Id.RootDomain &&
      domainRole?.targetAddress === userAddress &&
      !domainRole.isMultiSig,
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
  colony: ColonyFragment,
  userAddress: Address | undefined,
): ColonyRole[] => {
  if (!userAddress) return [];

  const userRolesInAnyDomain = colony.roles?.items.find(
    (domainRole) =>
      domainRole?.targetAddress === userAddress && !domainRole.isMultiSig,
  );

  return Array.from(new Set([...convertRolesToArray(userRolesInAnyDomain)]));
};
