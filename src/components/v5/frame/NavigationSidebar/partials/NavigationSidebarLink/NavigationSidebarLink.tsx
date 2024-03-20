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
        'flex min-h-[2.25rem] w-full items-center justify-between gap-4 rounded-lg bg-base-white px-2.5 transition-all text-2 md:hover:bg-gray-900 md:hover:text-base-white',
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
      <Icon className="flex-shrink-0 text-current" size={16} />
      {children}
    </span>
    {tagProps && (
      <ExtensionStatusBadge className="flex-shrink-0" {...tagProps} />
    )}
  </NavLink>
);

NavigationSidebarLink.displayName = displayName;

export default NavigationSidebarLink;
