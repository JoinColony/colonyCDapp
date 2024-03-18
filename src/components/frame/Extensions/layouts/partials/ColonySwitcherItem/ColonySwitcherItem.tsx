import { type Icon } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';
import { NavLink } from 'react-router-dom';

import useNavigationSidebarContext from '~v5/frame/NavigationSidebar/partials/NavigationSidebarContext/hooks.ts';
import ColonyAvatar from '~v5/shared/ColonyAvatar/index.ts';

const displayName = 'frame.Extensions.partials.ColonySwitcherItem';

export interface ColonySwitcherItemProps {
  link: string;
  name: string;
  colonyAddress: string;
  ChainIcon?: Icon;
  avatarSrc?: string;
}

const ColonySwitcherItem: FC<ColonySwitcherItemProps> = ({
  link,
  name,
  colonyAddress,
  ChainIcon,
  avatarSrc,
}) => {
  const { setOpenItemIndex } = useNavigationSidebarContext();

  return (
    <NavLink
      title={name}
      className={clsx(
        '-mx-2 flex min-h-[2.25rem] items-center gap-4 rounded-lg bg-base-white px-2 transition-all text-2 md:hover:bg-gray-900 md:hover:text-base-white',
        {
          'justify-between': !!ChainIcon,
        },
      )}
      to={link}
      onClick={
        link === window.location.pathname
          ? () => setOpenItemIndex(undefined)
          : undefined
      }
    >
      <div className="flex items-center gap-2 truncate">
        <ColonyAvatar
          size={18}
          colonyAddress={colonyAddress}
          colonyImageProps={avatarSrc ? { src: avatarSrc } : undefined}
        />
        <p className="max-w-[13.313rem] truncate text-2">{name}</p>
      </div>
      {ChainIcon && <ChainIcon size={18} />}
    </NavLink>
  );
};

ColonySwitcherItem.displayName = displayName;

export default ColonySwitcherItem;
