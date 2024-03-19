import { type Icon } from '@phosphor-icons/react';

export interface ColonyAvatarProps {
  className?: string;
  colonyAddress: string;
  chainIcon?: Icon;
  colonyImageSrc?: string;
  size: number;
}
