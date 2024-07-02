import { ColonyRole } from '@colony/colony-js';

import {
  type ColonyActionRoles,
  type GetColonyHistoricRoleRolesQuery,
} from '~gql';

export const transformActionRolesToColonyRoles = (
  roles: ColonyActionRoles | null | undefined,
  historicRoles: GetColonyHistoricRoleRolesQuery['getColonyHistoricRole'],
): ColonyRole[] => {
  if (!roles) return [];

  const combinedRoles = { ...historicRoles };

  for (const [key, value] of Object.entries(roles)) {
    if (value !== null) {
      combinedRoles[key] = value;
    }
  }

  const roleKeys = Object.keys(combinedRoles);

  const colonyRoles: ColonyRole[] = roleKeys
    .filter((key) => combinedRoles[key])
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

export const transformRemovedActionRolesToColonyRoles = (
  roles: ColonyActionRoles | null | undefined,
): ColonyRole[] =>
  Object.keys(roles || {})
    .filter((keyName) => keyName.startsWith('role_'))
    .map((keyName) => {
      if (roles?.[keyName] === false) {
        const match = keyName.match(/role_(\d+)/); // Extract the role number
        if (match && match[1]) {
          const roleIndex = parseInt(match[1], 10);
          if (roleIndex in ColonyRole) {
            return roleIndex;
          }
        }
        return null;
      }
      return undefined;
    })
    .filter((value): value is ColonyRole => value !== undefined);
