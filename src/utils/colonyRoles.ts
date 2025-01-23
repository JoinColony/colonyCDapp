import { ColonyRole } from '@colony/colony-js';

import {
  type ColonyActionRoles,
  type GetColonyHistoricRoleRolesQuery,
} from '~gql';
import {
  type ColonyRole as ColonyRoleFragment,
  type Colony,
} from '~types/graphql.ts';

import { notMaybe } from './arrays/index.ts';
import { formatText } from './intl.ts';

export const extractColonyRoles = (
  colonyRoles: Colony['roles'],
): ColonyRoleFragment[] => {
  return colonyRoles?.items.filter(notMaybe) ?? [];
};

export const transformApiRolesToArray = (
  roles:
    | GetColonyHistoricRoleRolesQuery['getColonyHistoricRole']
    | ColonyActionRoles,
): ColonyRole[] => {
  if (!roles) {
    return [];
  }

  const colonyRoles: ColonyRole[] = Object.keys(roles)
    .filter((key) => roles[key] === true)
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

export const getMultipleRolesText = (roles: ColonyRole[]): string => {
  return roles.map((roleId) => formatText({ id: `role.${roleId}` })).join(', ');
};
