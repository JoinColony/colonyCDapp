import clsx from 'clsx';
import React, { FC } from 'react';
import Icon from '~shared/Icon';
import { ColonyAvatarProps } from './types';

const displayName = 'v5.ColonyAvatar';

const ColonyAvatar: FC<ColonyAvatarProps> = ({
  chainImageProps,
  colonyImageProps,
  className,
}) => {
  return (
    <div
      className={clsx(
        className,
        'flex justify-center items-center flex-shrink-0 relative text-[2.25rem] h-[1em] w-[1em]',
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
            alt={colonyImageProps?.alt || 'Colony image'}
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <Icon
            name="colony-placeholder"
            className="h-full w-full text-white"
          />
        )}
      </figure>
      {chainImageProps?.src && (
        <figure
          className={`
          h-[0.5em]
          w-[0.5em]
          rounded-full
          border
          border-gray-200
          bg-white
          overflow-hidden
          p-[2%]
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
          <img
            {...chainImageProps}
            alt={chainImageProps?.alt || 'Chain image'}
            className="h-[96%] w-[96%] object-cover object-center rounded-full"
          />
        </figure>
      )}
    </div>
  );
};

ColonyAvatar.displayName = displayName;

export default ColonyAvatar;
