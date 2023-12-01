import isEqual from 'lodash/isEqual';
import { ColonyRole } from '@colony/colony-js';

import { formatText } from '~utils/intl';

export const USER_ROLE = {
  Mod: 'mod',
  Payer: 'payer',
  Admin: 'admin',
  Owner: 'owner',
  Custom: 'custom',
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export interface UserRoleMeta {
  name: string;
  role: UserRole;
  permissions: ColonyRole[];
}

export const USER_ROLES: UserRoleMeta[] = [
  {
    role: USER_ROLE.Mod,
    name: formatText({ id: 'role.mod' }),
    permissions: [ColonyRole.Administration],
  },
  {
    role: USER_ROLE.Payer,
    name: formatText({ id: 'role.payer' }),
    permissions: [
      ColonyRole.Administration,
      ColonyRole.Funding,
      ColonyRole.Arbitration,
    ],
  },
  {
    role: USER_ROLE.Admin,
    name: formatText({ id: 'role.admin' }),
    permissions: [
      ColonyRole.Administration,
      ColonyRole.Funding,
      ColonyRole.Arbitration,
      ColonyRole.Architecture,
    ],
  },
  {
    role: USER_ROLE.Owner,
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
  role: USER_ROLE.Custom,
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
