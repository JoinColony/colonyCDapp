import { type Icon } from '@phosphor-icons/react';
import { type ImgHTMLAttributes } from 'react';

export interface ColonyAvatarProps {
  colonyAddress: string;
  chainIcon?: Icon;
  colonyImageProps?: ImgHTMLAttributes<HTMLImageElement>;
  className?: string;
  size: number;
}
