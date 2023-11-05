import { TabItem } from '~shared/Extensions/Tabs/types';
import { Token, UserStake } from '~types';
import { ExtensionStatusBadgeMode } from '~v5/common/Pills/types';

export interface StakesTabItemProps {
  key: string;
  title: string;
  date: string;
  stake: string;
  transfer: string;
  status?: Omit<
    ExtensionStatusBadgeMode,
    'staking' | 'finalizable' | 'claimed'
  >;
  userStake: UserStake;
  nativeToken: Token;
}

// @TODO: Rename this...
export interface StakesTabItem extends Omit<TabItem, 'type'> {
  type: 'all' | 'finalized' | 'claimable';
}

export interface StakesTabProps {
  claimedNotificationNumber?: number;
}
