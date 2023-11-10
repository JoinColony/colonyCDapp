import clsx from 'clsx';
import React, { FC } from 'react';
import Icon from '~shared/Icon';
import ColonyAvatar from '~v5/shared/ColonyAvatar';
import Link from '~v5/shared/Link';
import { ColonySwitcherItemProps } from './types';

const displayName = 'frame.Extensions.partials.ColonySwitcherItem';

const ColonySwitcherItem: FC<ColonySwitcherItemProps> = ({
  name,
  avatarProps,
  ...rest
}) => {
  const { chainIconName, ...restAvatarProps } = avatarProps || {};

  return (
    <Link
      title={name}
      className={clsx(
        'flex items-center gap-4 text-gray-900 py-[0.625rem] px-2 group md:hover:bg-gray-900 md:hover:text-base-white rounded-lg',
        {
          'justify-between': chainIconName,
        },
      )}
      {...rest}
    >
      <div className="flex items-center gap-2">
        <ColonyAvatar size="small" {...restAvatarProps} />
        <p className="text-2">{name}</p>
      </div>
      {chainIconName && (
        <Icon
          name={chainIconName}
          appearance={{
            size: 'small',
          }}
        />
      )}
    </Link>
  );
};

ColonySwitcherItem.displayName = displayName;

export default ColonySwitcherItem;
