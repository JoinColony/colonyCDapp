import { ColonyRole } from '@colony/colony-js';

import {
  type GetColonyHistoricRoleRolesQuery,
  type ColonyActionRoles,
} from '~gql';
import { removeObjectFields } from '~utils/objects/index.ts';

export const getIsPermissionsRemoval = (
  roles:
    | GetColonyHistoricRoleRolesQuery['getColonyHistoricRole']
    | ColonyActionRoles,
) => {
  const finalRoles = removeObjectFields(roles, ['__typename']);

  if (!finalRoles) {
    return false;
  }

  return Object.values(finalRoles).every((role) => role === false);
};

export const transformActionRolesToColonyRoles = (
  roles:
    | GetColonyHistoricRoleRolesQuery['getColonyHistoricRole']
    | ColonyActionRoles,
  args?: {
    isMotion?: boolean;
  },
): ColonyRole[] => {
  const finalRoles = removeObjectFields(roles, ['__typename']);

  if (!finalRoles) return [];

  let roleKeys = Object.keys(finalRoles);

  if (getIsPermissionsRemoval(finalRoles) || args?.isMotion) {
    roleKeys = roleKeys.filter((key) => finalRoles[key]);
  }

  const colonyRoles: ColonyRole[] = roleKeys
    .filter((key) => finalRoles[key] !== null)
    .map((key) => {
      const match = key.match(/role_(\d+)/); // Extract the role number
      if (match && match[1]) {
        const roleIndex = parseInt(match[1], 10);
        if (roleIndex in ColonyRole) {
          return roleIndex;
        }
      }
      return null;
    })
    .filter((role): role is ColonyRole => role !== null);

  return colonyRoles;
};
