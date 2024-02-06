import { type Icon } from '@phosphor-icons/react';
import { type ImgHTMLAttributes } from 'react';

import { type AvatarSize } from '../Avatar/types.ts';

export interface ColonyAvatarProps {
  colonyAddress: string;
  chainIcon?: Icon;
  colonyImageProps?: ImgHTMLAttributes<HTMLImageElement>;
  className?: string;
  size?: AvatarSize;
}
