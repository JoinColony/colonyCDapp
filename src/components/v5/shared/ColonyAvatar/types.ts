import { type Icon } from '@phosphor-icons/react';

export interface ColonyAvatarProps {
  className?: string;
  colonyAddress: string;
  colonyName?: string;
  chainIcon?: Icon;
  colonyImageSrc?: string;
  size: number;
}
