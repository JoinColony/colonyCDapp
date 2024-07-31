import clsx from 'clsx';
import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { formatText } from '~utils/intl.ts';

import { Avatar } from '../Avatar/Avatar.tsx';

import { type ColonyAvatarProps } from './types.ts';

const displayName = 'v5.shared.ColonyAvatar';

const MSG = defineMessages({
  defaultAlt: {
    id: `${displayName}.colonyAvatarAlt`,
    defaultMessage: 'Avatar of colony {name}',
  },
});

const ColonyAvatar: FC<ColonyAvatarProps> = ({
  colonyAddress,
  chainIcon: ChainIcon,
  colonyImageSrc,
  colonyName,
  size,
  className,
}) => {
  return (
    <div className={clsx(className, 'relative flex-shrink-0')}>
      <Avatar
        size={size}
        alt={formatText(MSG.defaultAlt, { name: colonyName ?? colonyAddress })}
        src={colonyImageSrc}
        address={colonyAddress}
      />
      {ChainIcon && (
        <figure
          className={`
            absolute
            right-0
            top-0
            flex
            h-[1.1875rem]
            w-[1.1875rem]
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
          <ChainIcon size={14} />
        </figure>
      )}
    </div>
  );
};

ColonyAvatar.displayName = displayName;

export default ColonyAvatar;
