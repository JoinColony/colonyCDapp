import { TabItem } from '~shared/Extensions/Tabs/types';
import { ExtensionStatusBadgeMode } from '~v5/common/Pills/types';

export interface StakesProps {
  key: string;
  title: string;
  date: string;
  stake: string;
  transfer: string;
  status?: Omit<
    ExtensionStatusBadgeMode,
    'staking' | 'finalizable' | 'claimed'
  >;
}

export interface StakesTabItem extends Omit<TabItem, 'type'> {
  type: 'all' | 'finalized' | 'claimable';
}

export interface StakesTabProps {
  claimedNotificationNumber?: number;
}
