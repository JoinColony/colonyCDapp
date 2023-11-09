import { ExtensionStatusBadgeMode } from '~v5/common/Pills/types';

export interface StakesTabItemProps {
  title: string;
  date: string;
  stake: string;
  transfer: string;
  status?: Omit<
    ExtensionStatusBadgeMode,
    'staking' | 'finalizable' | 'claimed'
  >;
}
