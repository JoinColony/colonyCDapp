import { ColonyRole } from '@colony/colony-js';

import { CUSTOM_USER_ROLE, getRole, UserRole } from '~constants/permissions.ts';
import { ColonyContributor } from '~types/graphql.ts';

export const hasSomeRole = (
  roles: object,
  permissionsFilter: Record<UserRole, number[]> | undefined,
) => {
  if (!permissionsFilter) {
    // if no permissions filters are set, just check user has at least one permission
    return Object.keys(roles).some((key) => {
      return key.startsWith('role_') && !!roles[key];
    });
  }

  const permissions = Object.entries(roles)
    .filter(([key]) => key.startsWith('role_'))
    .reduce<ColonyRole[]>((result, [key, value]) => {
      if (!value) {
        return result;
      }
      return [...result, Number(key.replace('role_', ''))];
    }, []);

  const role = getRole(permissions);
  const isInFilters =
    !!permissionsFilter[role.name] && role.name !== CUSTOM_USER_ROLE.name;
  const customPermissions = permissionsFilter[CUSTOM_USER_ROLE.name];

  const includesCustomPermissions = customPermissions?.some((permission) =>
    role.permissions.includes(permission),
  );

  return includesCustomPermissions || isInFilters;
};

export const sortByReputationAscending = (items: ColonyContributor[]) => {
  return items.sort(
    (a, b) => a.colonyReputationPercentage - b.colonyReputationPercentage,
  );
};

export const sortByReputationDescending = (items: ColonyContributor[]) => {
  return items.sort(
    (a, b) => b.colonyReputationPercentage - a.colonyReputationPercentage,
  );
};
