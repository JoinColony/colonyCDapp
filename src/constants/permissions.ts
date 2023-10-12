import isEqual from 'lodash/isEqual';
import { ColonyRole } from '@colony/colony-js';
import { formatText } from '~utils/intl';

interface UserRole {
  name: string;
  permissions: ColonyRole[];
}

export const ROLES: UserRole[] = [
  {
    name: formatText({ id: 'role.mod' }) || '',
    permissions: [ColonyRole.Administration],
  },
  {
    name: formatText({ id: 'role.payer' }) || '',
    permissions: [
      ColonyRole.Administration,
      ColonyRole.Funding,
      ColonyRole.Arbitration,
    ],
  },
  {
    name: formatText({ id: 'role.admin' }) || '',
    permissions: [
      ColonyRole.Administration,
      ColonyRole.Funding,
      ColonyRole.Arbitration,
      ColonyRole.Architecture,
    ],
  },
  {
    name: formatText({ id: 'role.owner' }) || '',
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

export const getRole = (permissionsList: ColonyRole[]): UserRole =>
  ROLES.find(({ permissions }) =>
    isEqual(permissions.sort(), permissionsList.sort()),
  ) || {
    name: formatText({ id: 'role.custom' }) || '',
    permissions: permissionsList,
  };
