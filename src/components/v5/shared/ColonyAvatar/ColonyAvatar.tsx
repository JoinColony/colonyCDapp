import clsx from 'clsx';
import React, { FC } from 'react';

import Icon from '~shared/Icon/index.ts';
import { formatText } from '~utils/intl.ts';

import Avatar from '../Avatar/index.ts';

import { ColonyAvatarProps } from './types.ts';

const displayName = 'v5.ColonyAvatar';

const ColonyAvatar: FC<ColonyAvatarProps> = ({
  colonyAddress,
  chainIconName,
  colonyImageProps,
  size = 'xms',
  className,
}) => {
  return (
    <div
      className={clsx(
        className,
        'flex justify-center items-center flex-shrink-0 relative h-[1em] w-[1em]',
        {
          'h-16 w-16 text-6xl': size === 'xm',
          'h-[3.75em] w-[3.75em] text-6xl': size === 'm',
          'text-4xl': size === 'xms',
          'text-3xl': size === 'smx',
          'text-2xl': size === 'xxsm',
          'text-lg': size === 'xxs',
        },
      )}
    >
      <div
        className={clsx(
          'h-full w-full rounded-full overflow-hidden flex justify-center items-center',
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
      {chainIconName && (
        <figure
          className={`
          h-[0.5em]
          w-[0.5em]
          rounded-full
          border
          border-gray-200
          bg-base-white
          overflow-hidden
          absolute
          top-0
          right-0
          translate-x-[.375rem]
          -translate-y-[.375rem]
          flex
          justify-center
          items-center
      `}
        >
          <Icon
            name={chainIconName}
            appearance={{ size: 'tiny' }}
            className="h-[96%] w-[96%]"
          />
        </figure>
      )}
    </div>
  );
};

ColonyAvatar.displayName = displayName;

export default ColonyAvatar;
