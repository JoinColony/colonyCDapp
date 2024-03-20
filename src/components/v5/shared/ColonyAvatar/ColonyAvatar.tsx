import clsx from 'clsx';
import React, { type FC } from 'react';

import { formatText } from '~utils/intl.ts';

import Avatar from '../Avatar/index.ts';

import { type ColonyAvatarProps } from './types.ts';

const displayName = 'v5.ColonyAvatar';

const ColonyAvatar: FC<ColonyAvatarProps> = ({
  colonyAddress,
  chainIcon: Icon,
  colonyImageProps,
  size = 'xms',
  className,
}) => {
  return (
    <div
      className={clsx(
        className,
        'relative flex h-[1em] w-[1em] flex-shrink-0 items-center justify-center',
        {
          'text-6xl h-16 w-16': size === 'xm',
          'text-6xl h-[3.75em] w-[3.75em]': size === 'm',
          'text-4xl': size === 'xms',
          'text-3xl': size === 'smx',
          'text-2xl': size === 'xxsm',
          // @TODO: This is getting out of hand, maybe let's just use pixel values (as with the icons)
          'text-lg': size === 'xxs',
          'text-xl': size === 'xss',
        },
      )}
    >
      <div
        className={clsx(
          'flex h-full w-full items-center justify-center overflow-hidden rounded-full',
        )}
      >
        {colonyImageProps?.src ? (
          <img
            {...colonyImageProps}
            alt={
              colonyImageProps?.alt ||
              formatText({ id: 'colonyAvatar.colonyImage.alt' })
            }
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <Avatar size={size} seed={colonyAddress.toLowerCase()} />
        )}
      </div>
      {Icon && (
        <figure
          className={`
          absolute
          right-0
          top-0
          flex
          h-[0.5em]
          w-[0.5em]
          -translate-y-[.375rem]
          translate-x-[.375rem]
          items-center
          justify-center
          overflow-hidden
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
