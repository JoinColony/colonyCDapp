import { type ImgHTMLAttributes } from 'react';

import { type AvatarSize } from '../Avatar/types.ts';

export interface ColonyAvatarProps {
  colonyAddress: string;
  chainIconName?: string;
  colonyImageProps?: ImgHTMLAttributes<HTMLImageElement>;
  className?: string;
  size?: AvatarSize;
}
