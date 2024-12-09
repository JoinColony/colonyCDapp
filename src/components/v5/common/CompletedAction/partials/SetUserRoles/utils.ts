import { ColonyRole } from '@colony/colony-js';

import {
  type GetColonyHistoricRoleRolesQuery,
  type ColonyActionRoles,
} from '~gql';

export const transformActionRolesToColonyRoles = (
  roles:
    | GetColonyHistoricRoleRolesQuery['getColonyHistoricRole']
    | ColonyActionRoles,
): ColonyRole[] => {
  if (!roles) return [];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { __typename, ...finalRoles } = roles;

  let roleKeys = Object.keys(finalRoles);

  const isRemovePermissionsAction = !Object.values(finalRoles).every(
    (role) => !role,
  );

  if (isRemovePermissionsAction) {
    roleKeys = roleKeys.filter((key) => finalRoles[key]);
  }

  const colonyRoles: ColonyRole[] = roleKeys
    .filter((key) => roles[key] !== null)
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
