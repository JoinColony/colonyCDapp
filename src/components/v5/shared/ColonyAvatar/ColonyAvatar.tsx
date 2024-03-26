import clsx from 'clsx';
import React, { type FC } from 'react';

import { Avatar } from '../Avatar/Avatar.tsx';

import { type ColonyAvatarProps } from './types.ts';

const displayName = 'v5.ColonyAvatar';

const ColonyAvatar: FC<ColonyAvatarProps> = ({
  colonyAddress,
  chainIcon: Icon,
  colonyImageSrc,
  colonyName,
  size,
  className,
}) => {
  return (
    <div
      className={clsx(
        className,
        'relative flex flex-shrink-0 items-center justify-center',
      )}
    >
      <Avatar
        size={size}
        alt={`Avatar of colony ${colonyName ?? colonyAddress}`}
        src={colonyImageSrc}
        address={colonyAddress}
      />
      {Icon && (
        <figure
          className={`
          h-[1.1875rem]
          w-[1.1875rem]
          rounded-full
          border
          border-gray-200
          bg-base-white
      `}
        >
          <Icon size={14} />
        </figure>
      )}
    </div>
  );
};

ColonyAvatar.displayName = displayName;

export default ColonyAvatar;
