import { ColonyRole } from '@colony/colony-js';
import isEqual from 'lodash/isEqual';

import { formatText } from '~utils/intl.ts';

export enum UserRole {
  Mod = 'mod',
  Payer = 'payer',
  Admin = 'admin',
  Owner = 'owner',
  Custom = 'custom',
}

export interface UserRoleMeta {
  name: string;
  role: UserRole;
  permissions: ColonyRole[];
}

export const USER_ROLES: UserRoleMeta[] = [
  {
    role: UserRole.Mod,
    name: formatText({ id: 'role.mod' }),
    permissions: [ColonyRole.Administration],
  },
  {
    role: UserRole.Payer,
    name: formatText({ id: 'role.payer' }),
    permissions: [
      ColonyRole.Administration,
      ColonyRole.Funding,
      ColonyRole.Arbitration,
    ],
  },
  {
    role: UserRole.Admin,
    name: formatText({ id: 'role.admin' }),
    permissions: [
      ColonyRole.Administration,
      ColonyRole.Funding,
      ColonyRole.Arbitration,
      ColonyRole.Architecture,
    ],
  },
  {
    role: UserRole.Owner,
    name: formatText({ id: 'role.owner' }),
    permissions: [
      ColonyRole.Administration,
      ColonyRole.Funding,
      ColonyRole.Arbitration,
      ColonyRole.Architecture,
      ColonyRole.Recovery,
      ColonyRole.Root,
    ],
  },
];

export const CUSTOM_USER_ROLE: UserRoleMeta = {
  role: UserRole.Custom,
  name: formatText({ id: 'role.custom' }),
  permissions: [],
};

export const getRole = (permissionsList: ColonyRole[]): UserRoleMeta =>
  USER_ROLES.find(({ permissions }) =>
    isEqual(permissions.sort(), permissionsList.sort()),
  ) || {
    ...CUSTOM_USER_ROLE,
    permissions: permissionsList,
  };
