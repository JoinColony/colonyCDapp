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

export const PERMISSIONS_TABLE_CONTENT: Record<
  Exclude<UserRole, 'custom'>,
  { heading: string; permissions: React.ReactNode[] }
> = {
  [UserRole.Owner]: {
    heading: 'Owner permissions',
    permissions: [
      formatText({ id: 'permissions.moderation' }),
      formatText({ id: 'permissions.simplePayments' }),
      formatText({ id: 'permissions.advancedPayments' }),
      formatText({ id: 'permissions.batchPayments' }),
      formatText({ id: 'permissions.splitPayments' }),
      formatText({ id: 'permissions.stagedPayments' }),
      formatText({ id: 'permissions.streamingPayments' }),
      formatText({ id: 'permissions.penaliseReputation' }),
      formatText({ id: 'permissions.awardReputation' }),
      formatText({ id: 'permissions.createATeam' }),
      formatText({ id: 'permissions.editTeam' }),
      formatText({ id: 'permissions.managePermissions' }),
      formatText({ id: 'permissions.banMember' }),
      formatText({ id: 'permissions.manageVerifiedMembers' }),
      formatText({ id: 'permissions.mintTokens' }),
      formatText({ id: 'permissions.unlockToken' }),
      formatText({ id: 'permissions.manageTokens' }),
      formatText({ id: 'permissions.upgradeColonyVersion' }),
    ],
  },
  [UserRole.Admin]: {
    heading: 'Admin permissions',
    permissions: [
      formatText({ id: 'permissions.moderation' }),
      formatText({ id: 'permissions.simplePayments' }),
      formatText({ id: 'permissions.advancedPayments' }),
      formatText({ id: 'permissions.batchPayments' }),
      formatText({ id: 'permissions.splitPayments' }),
      formatText({ id: 'permissions.stagedPayments' }),
      formatText({ id: 'permissions.streamingPayments' }),
      formatText({ id: 'permissions.penaliseReputation' }),
      formatText({ id: 'permissions.createTeams' }),
      formatText({ id: 'permissions.editTeams' }),
      formatText({ id: 'permissions.manageChildPermissions' }),
      formatText({ id: 'permissions.addToVerifiedMembers' }),
    ],
  },
  [UserRole.Payer]: {
    heading: 'Payer permissions',
    permissions: [
      formatText({ id: 'permissions.moderation' }),
      formatText({ id: 'permissions.simplePayments' }),
      formatText({ id: 'permissions.advancedPayments' }),
      formatText({ id: 'permissions.batchPayments' }),
      formatText({ id: 'permissions.splitPayments' }),
      formatText({ id: 'permissions.stagedPayments' }),
      formatText({ id: 'permissions.streamingPayments' }),
      formatText({ id: 'permissions.penaliseReputation' }),
    ],
  },
  [UserRole.Mod]: {
    heading: 'Mod permissions',
    permissions: [formatText({ id: 'permissions.moderation' })],
  },
};
