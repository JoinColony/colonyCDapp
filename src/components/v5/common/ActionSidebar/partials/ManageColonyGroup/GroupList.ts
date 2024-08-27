import {
  ArrowUpRight,
  Coins,
  LockSimpleOpen,
  CoinVertical,
  UsersThree,
  Pencil,
  UserSwitch,
  IdentificationCard,
  HouseLine,
  Upload,
  UserCircleCheck,
  TrafficCone,
} from '@phosphor-icons/react';

import { Action } from '~constants/actions.ts';
import { formatText } from '~utils/intl.ts';

export const GROUP_FUNDS_LIST = [
  {
    title: formatText({ id: 'actions.transferFunds' }),
    description: formatText({
      id: 'actions.description.transferFunds',
    }),
    Icon: ArrowUpRight,
    action: Action.TransferFunds,
  },
  {
    title: formatText({ id: 'actions.mintTokens' }),
    description: formatText({
      id: 'actions.description.mintTokens',
    }),
    Icon: Coins,
    action: Action.MintTokens,
  },
  {
    title: formatText({ id: 'actions.unlockToken' }),
    description: formatText({
      id: 'actions.description.unlockToken',
    }),
    Icon: LockSimpleOpen,
    action: Action.UnlockToken,
  },
  {
    title: formatText({ id: 'actions.manageTokens' }),
    description: formatText({
      id: 'actions.description.manageTokens',
    }),
    Icon: CoinVertical,
    action: Action.ManageTokens,
  },
];

export const GROUP_TEAMS_LIST = [
  {
    title: formatText({ id: 'actions.createNewTeam' }),
    description: formatText({
      id: 'actions.description.createNewTeam',
    }),
    Icon: UsersThree,
    action: Action.CreateNewTeam,
  },
  {
    title: formatText({ id: 'actions.editExistingTeam' }),
    description: formatText({
      id: 'actions.description.editExistingTeam',
    }),
    Icon: Pencil,
    action: Action.EditExistingTeam,
  },
];

export const GROUP_ADMIN_LIST = [
  {
    title: formatText({ id: 'actions.manageReputation' }),
    description: formatText({
      id: 'actions.description.manageReputation',
    }),
    Icon: UserSwitch,
    action: Action.ManageReputation,
  },
  {
    title: formatText({ id: 'actions.managePermissions' }),
    description: formatText({
      id: 'actions.description.managePermissions',
    }),
    Icon: IdentificationCard,
    action: Action.ManagePermissions,
  },
  {
    title: formatText({ id: 'actions.editColonyDetails' }),
    description: formatText({
      id: 'actions.description.editColonyDetails',
    }),
    Icon: HouseLine,
    action: Action.EditColonyDetails,
  },
  {
    title: formatText({ id: 'actions.upgradeColonyVersion' }),
    description: formatText({
      id: 'actions.description.upgradeColonyVersion',
    }),
    Icon: Upload,
    action: Action.UpgradeColonyVersion,
  },
  {
    title: formatText({ id: 'actions.manageVerifiedMembers' }),
    description: formatText({
      id: 'actions.description.manageVerifiedMembers',
    }),
    Icon: UserCircleCheck,
    action: Action.ManageVerifiedMembers,
  },
  {
    title: formatText({ id: 'actions.enterRecoveryMode' }),
    description: formatText({
      id: 'actions.description.enterRecoveryMode',
    }),
    Icon: TrafficCone,
    action: Action.EnterRecoveryMode,
  },
];
