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
    <picture className={className}>
      <img
        className="rounded-full"
        src={source}
        alt={alt ?? `Avatar of ${address}`}
        style={{
          width: size,
          height: size,
          imageRendering: src ? undefined : 'pixelated',
        }}
      />
    </picture>
  );
};

Avatar.displayName = displayName;

export default Avatar;
