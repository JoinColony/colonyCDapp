import { type Icon } from '@phosphor-icons/react';

import { type UserStakeStatus } from '~types/userStake.ts';

import { type ContributorType } from '../TableFiltering/types.ts';

export type ExtensionStatusBadgeMode =
  | 'coming-soon'
  | 'not-installed'
  | 'installed'
  | 'enabled'
  | 'disabled'
  | 'deprecated'
  | 'governance'
  | 'new'
  | 'staking'
  | 'finalizable'
  | 'claimed'
  | 'extension'
  | 'payments';

export type AvailableExtensionStatusBadgeMode = Extract<
  ExtensionStatusBadgeMode,
  'installed' | 'enabled' | 'disabled' | 'deprecated' | 'not-installed'
>;

export type UserStatusMode =
  | ContributorType
  | 'dedicated-filled'
  | 'active-filled'
  | 'active-new'
  | 'top-filled'
  | 'banned'
  | 'team'
  | 'verified';

export type PillSize = 'medium' | 'small';

export interface PillsProps {
  mode?: ExtensionStatusBadgeMode | UserStatusMode;
  text?: React.ReactNode;
  icon?: Icon;
  iconSize?: number;
  iconClassName?: string;
  pillSize?: PillSize;
  className?: string;
  textClassName?: string;
  isIconVisible?: boolean;
  isCapitalized?: boolean;
}

export interface UserStakeStatusBadgeProps extends Omit<PillsProps, 'mode'> {
  status: UserStakeStatus;
}
