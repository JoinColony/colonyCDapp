import clsx from 'clsx';
import React, { type FC } from 'react';
import { NavLink } from 'react-router-dom';

import { ADDRESS_ZERO } from '~constants/index.ts';
import ColonyAvatar from '~v5/shared/ColonyAvatar/index.ts';

import { type ColonySwitcherItemProps } from './types.ts';

const displayName = 'frame.Extensions.partials.ColonySwitcherItem';

const ColonySwitcherItem: FC<ColonySwitcherItemProps> = ({
  name,
  avatarProps,
  ...rest
}) => {
  const { chainIcon: Icon, ...restAvatarProps } = avatarProps || {
    colonyAddress: ADDRESS_ZERO,
  };

  return (
    <NavLink
      title={name}
      className={clsx(
        'flex items-center gap-4 text-2 px-2 rounded-lg transition-all bg-base-white md:hover:bg-gray-900 md:hover:text-base-white min-h-[2.25rem] -mx-2',
        {
          'justify-between': !!Icon,
        },
      )}
      {...rest}
    >
      <div className="flex items-center gap-2 truncate">
        <ColonyAvatar size="xxsx" {...restAvatarProps} />
        <p className="text-2 truncate max-w-[13.313rem]">{name}</p>
      </div>
      {Icon && <Icon size={18} />}
    </NavLink>
  );
};

ColonySwitcherItem.displayName = displayName;

export default ColonySwitcherItem;
