import { ContributorType } from '../TableFiltering/types';

export type ExtensionStatusBadgeMode =
  | 'coming-soon'
  | 'not-installed'
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

export type UserStatusMode =
  | ContributorType
  | 'dedicated-filled'
  | 'active-filled'
  | 'active-new'
  | 'top-filled'
  | 'banned'
  | 'team'
  | 'verified';

export type IconSize = 'extraTiny' | 'tiny';

export type PillSize = 'medium' | 'small';

export type PillsProps = {
  mode?: ExtensionStatusBadgeMode | UserStatusMode;
  text?: React.ReactNode;
  iconName?: string;
  iconSize?: IconSize;
  pillSize?: PillSize;
  className?: string;
  teamName?: string;
  isIconVisible?: boolean;
};
