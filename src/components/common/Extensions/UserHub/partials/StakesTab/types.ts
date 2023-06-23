import { ExtensionStatusBadgeMode } from '~v5/common/Pills/ExtensionStatusBadge/types';

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
