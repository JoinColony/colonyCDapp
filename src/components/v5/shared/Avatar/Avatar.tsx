import clsx from 'clsx';
import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { formatText } from '~utils/intl.ts';

import getIcon from './identicon.ts';

const displayName = 'v5.shared.Avatar';

const MSG = defineMessages({
  defaultAlt: {
    id: `${displayName}.avatarAlt`,
    defaultMessage: 'Avatar of {address}',
  },
});

export interface AvatarProps {
  className?: string;
  src?: string;
  alt?: string;
  address: string;
  size: number;
  testId?: string;
}

export const Avatar: FC<AvatarProps> = ({
  address,
  alt,
  className,
  size,
  src,
  testId,
}) => {
  const source = src ?? getIcon(address.toLowerCase());

  return (
    <img
      data-testid={testId}
      className={clsx('rounded-full', className)}
      src={source}
      alt={alt ?? formatText(MSG.defaultAlt, { address })}
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
