import React, { FC } from 'react';
import clsx from 'clsx';

import Icon from '~shared/Icon';
import { formatText } from '~utils/intl';

import { ColonyAvatarProps } from './types';

const displayName = 'v5.ColonyAvatar';

const ColonyAvatar: FC<ColonyAvatarProps> = ({
  chainIconName,
  colonyImageProps,
  size = 'default',
  className,
}) => {
  return (
    <div
      className={clsx(
        className,
        'flex justify-center items-center flex-shrink-0 relative h-[1em] w-[1em]',
        {
          'text-[2.25rem]': size === 'default',
          'text-[1.125rem]': size === 'small',
        },
      )}
    >
      <figure
        className={clsx(
          'h-full w-full rounded-full overflow-hidden flex justify-center items-center',
          {
            'bg-gray-900': !colonyImageProps,
          },
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
          <Icon
            name="colony-placeholder"
            className="text-base-white"
            appearance={{
              size: size === 'default' ? 'extraBig' : size,
            }}
          />
        )}
      </figure>
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
