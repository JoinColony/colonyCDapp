import { ColonyRole } from '@colony/colony-js';

import { type UserRole, USER_ROLE } from '~constants/permissions.ts';
import { formatText } from '~utils/intl.ts';

import { type CustomPermissionTableModel } from './types.ts';

import type React from 'react';

export const PERMISSIONS_TABLE_CONTENT: Record<
  Exclude<UserRole, 'custom'>,
  { heading: string; permissions: React.ReactNode[] }
> = {
  [USER_ROLE.Owner]: {
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
  [USER_ROLE.Admin]: {
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
  [USER_ROLE.Payer]: {
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
  [USER_ROLE.Mod]: {
    heading: 'Mod permissions',
    permissions: [formatText({ id: 'permissions.moderation' })],
  },
};

export const CUSTOM_PERMISSION_TABLE_CONTENT: CustomPermissionTableModel[] = [
  {
    key: ColonyRole.Root,
    name: ColonyRole.Root,
    overview: formatText({ id: 'permissions.custom.root.overview' }),
    type: formatText({ id: 'role.1' }),
  },
  {
    key: ColonyRole.Administration,
    name: ColonyRole.Administration,
    overview: formatText({ id: 'permissions.custom.administration.overview' }),
    type: formatText({ id: 'role.6' }),
  },
  {
    key: ColonyRole.Architecture,
    name: ColonyRole.Architecture,
    overview: formatText({ id: 'permissions.custom.architecture.overview' }),
    type: formatText({ id: 'role.3' }),
  },
  {
    key: ColonyRole.Funding,
    name: ColonyRole.Funding,
    overview: formatText({ id: 'permissions.custom.funding.overview' }),
    type: formatText({ id: 'role.5' }),
  },
  {
    key: ColonyRole.Recovery,
    name: ColonyRole.Recovery,
    overview: formatText({ id: 'permissions.custom.recovery.overview' }),
    type: formatText({ id: 'role.0' }),
  },
  {
    key: ColonyRole.Arbitration,
    name: ColonyRole.Arbitration,
    overview: formatText({ id: 'permissions.custom.arbitration.overview' }),
    type: formatText({ id: 'role.2' }),
  },
];
