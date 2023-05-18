import { ExtensionStatusBadgeMode } from '~common/Extensions/ExtensionStatusBadge-new/types';

export interface StakesProps {
  key: string;
  title: string;
  date: string;
  stake: string;
  transfer: string;
  status?: Omit<ExtensionStatusBadgeMode, 'staking' | 'finalizable' | 'claimed'>;
}
