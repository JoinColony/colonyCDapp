import { type ColonyRole } from '@colony/colony-js';

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

export const getMultipleRolesText = (roles: ColonyRole[]): string => {
  return roles.map((roleId) => formatText({ id: `role.${roleId}` })).join(', ');
};
