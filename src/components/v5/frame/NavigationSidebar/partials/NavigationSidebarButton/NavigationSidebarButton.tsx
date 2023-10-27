import React, { FC } from 'react';
import clsx from 'clsx';

import { useTablet } from '~hooks';
import Icon from '~shared/Icon';

import { NavigationSidebarButtonProps } from './types';

const displayName =
  'v5.frame.NavigationSidebar.partials.NavigationSidebarButton';

const NavigationSidebarButton: FC<NavigationSidebarButtonProps> = ({
  iconName,
  label,
  className,
  isActive,
  ...rest
}) => {
  const isTablet = useTablet();

  return (
    <button
      type="button"
      className={clsx(
        className,
        `
          group/navigation-button
          w-full
          md:w-auto
          text-left
          md:rounded-lg
          md:px-2.5
          py-2
          flex
          items-center
          justify-between
          md:justify-center
          gap-4
          md:gap-0
          md:transition-all
        `,
        {
          'text-blue-400 md:text-white md:bg-gray-900': isActive,
          'text-gray-900 md:bg-white md:hover:bg-gray-900 md:hover:text-white':
            !isActive,
        },
      )}
      {...rest}
    >
      {!isTablet && (
        <Icon
          name={iconName}
          className="h-[1em] w-[1em] text-[1.375rem] [&_svg]:fill-current"
        />
      )}
      <span
        className={`
          heading-5
          md:text-2
          md:max-w-0
          md:overflow-hidden
          md:group-hover/navigation-button:max-w-xs
          md:transition-[max-width]
        `}
      >
        <span className="md:pl-2 md:whitespace-nowrap">{label}</span>
      </span>
      {isTablet && (
        <Icon
          name="caret-down"
          className={clsx(
            'h-[1em] w-[1em] text-[0.75rem] [&_svg]:fill-current transition-transform',
            {
              'rotate-180': isActive,
            },
          )}
        />
      )}
    </button>
  );
};

NavigationSidebarButton.displayName = displayName;

export default NavigationSidebarButton;
