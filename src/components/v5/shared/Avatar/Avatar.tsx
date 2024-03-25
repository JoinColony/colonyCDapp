import clsx from 'clsx';
import React, { type FC } from 'react';

import getIcon from './identicon.ts';

const displayName = 'v5.Avatar';

export interface AvatarProps {
  className?: string;
  src?: string;
  alt?: string;
  address: string;
  size: number;
}

export const Avatar: FC<AvatarProps> = ({
  address,
  alt,
  className,
  size,
  src,
}) => {
  const source = src ?? getIcon(address.toLowerCase());

  return (
    <img
      className={clsx('rounded-full bg-cover', className)}
      src={source}
      alt={alt ?? `Avatar of ${address}`}
      style={{
        width: size,
        height: size,
        imageRendering: src ? undefined : 'pixelated',
      }}
    />
  );
};

Avatar.displayName = displayName;

export default Avatar;
