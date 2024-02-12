import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';
import { NavLink } from 'react-router-dom';

import ExtensionStatusBadge from '~v5/common/Pills/ExtensionStatusBadge/index.ts';

import { type NavigationSidebarLinkProps } from './types.ts';

const displayName = 'v5.frame.NavigationSidebar.partials.NavigationSidebarLink';

const NavigationSidebarLink: FC<
  PropsWithChildren<NavigationSidebarLinkProps>
> = ({ icon: Icon, tagProps, children, className, disabled, ...rest }) => (
  <NavLink
    end
    {...rest}
    className={({ isActive }) =>
      clsx(
        className,
        'flex items-center justify-between gap-4 w-full text-2 px-2.5 rounded-lg transition-all bg-base-white md:hover:bg-gray-900 md:hover:text-base-white min-h-[2.25rem]',
        {
          'bg-gray-900 text-base-white': isActive,
          'pointer-events-none': disabled,
          'py-[.3125rem]': tagProps,
          'py-2': !tagProps,
        },
      )
    }
  >
    <span className="flex items-center gap-2">
      <Icon className="text-current flex-shrink-0" size={16} />
      {children}
    </span>
    {tagProps && (
      <ExtensionStatusBadge className="flex-shrink-0" {...tagProps} />
    )}
  </NavLink>
);

NavigationSidebarLink.displayName = displayName;

export default NavigationSidebarLink;
