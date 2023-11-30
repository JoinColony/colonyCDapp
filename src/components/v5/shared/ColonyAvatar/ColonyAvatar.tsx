import React, { FC } from 'react';
import clsx from 'clsx';

import Icon from '~shared/Icon';
import { formatText } from '~utils/intl';

import Avatar from '../Avatar';

import { ColonyAvatarProps } from './types';
import { getBlockieSize } from './util';

const displayName = 'v5.ColonyAvatar';

const ColonyAvatar: FC<ColonyAvatarProps> = ({
  colonyAddress,
  chainIconName,
  colonyImageProps,
  size = 'extraBig',
  className,
}) => {
  return (
    <div
      className={clsx(
        className,
        'flex justify-center items-center flex-shrink-0 relative h-[1em] w-[1em]',
        {
          'text-4xl': size === 'extraBig',
          'text-3xl': size === 'medium',
          'text-2xl':
            size === 'mediumSmallMediumLargeSmallTinyBigMediumLargeSmall',
          'text-lg': size === 'small',
        },
      )}
    >
      <div
        className={clsx(
          'h-full w-full rounded-full overflow-hidden flex justify-center items-center',
        )}
      >
        {colonyImageProps ? (
          <img
            {...colonyImageProps}
            alt={
              colonyImageProps?.alt ||
              formatText({ id: 'colonyAvatar.colonyImage.alt' })
            }
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <Avatar
            size={getBlockieSize(size)}
            seed={colonyAddress.toLowerCase()}
          />
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
