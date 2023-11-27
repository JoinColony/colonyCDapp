import clsx from 'clsx';
import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';
import Icon from '~shared/Icon';
import ColonyAvatar from '~v5/shared/ColonyAvatar';
import { ColonySwitcherItemProps } from './types';

const displayName = 'frame.Extensions.partials.ColonySwitcherItem';

const ColonySwitcherItem: FC<ColonySwitcherItemProps> = ({
  name,
  avatarProps,
  ...rest
}) => {
  const { chainIconName, ...restAvatarProps } = avatarProps || {};

  return (
    <NavLink
      title={name}
      className={clsx(
        'flex items-center gap-4 text-2 px-2 rounded-lg transition-all bg-base-white md:hover:bg-gray-900 md:hover:text-base-white min-h-[2.25rem] -mx-2',
        {
          'justify-between': chainIconName,
        },
      )}
      {...rest}
    >
      <div className="flex items-center gap-2 truncate">
        <ColonyAvatar size="small" {...restAvatarProps} />
        <p className="text-2 truncate max-w-[13.313rem]">{name}</p>
      </div>
      {chainIconName && (
        <Icon
          name={chainIconName}
          appearance={{
            size: 'small',
          }}
        />
      )}
    </NavLink>
  );
};

ColonySwitcherItem.displayName = displayName;

export default ColonySwitcherItem;
