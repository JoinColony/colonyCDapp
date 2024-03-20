import { CaretDown } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';

import { useTablet } from '~hooks/index.ts';

import { type NavigationSidebarButtonProps } from './types.ts';

const displayName =
  'v5.frame.NavigationSidebar.partials.NavigationSidebarButton';

const NavigationSidebarButton: FC<NavigationSidebarButtonProps> = ({
  icon: Icon,
  label,
  className,
  hasSecondLevel,
  isActive,
  isExpanded,
  isHighlighted,
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
          flex
          w-full
          items-center
          justify-between
          gap-4
          px-2.5
          py-2
          text-left
          md:w-auto
          md:justify-center
          md:gap-0
          md:rounded-lg
          md:transition-all
        `,
        {
          'text-blue-400 md:bg-gray-900 md:text-base-white':
            isActive && !isTablet,
          'text-gray-900 md:hover:bg-gray-900 md:hover:text-base-white':
            !isActive && !isHighlighted,
          'bg-blue-100 text-blue-400': isHighlighted,
        },
      )}
      {...rest}
    >
      {!isTablet && <Icon size={22} />}
      <span
        className={`
          heading-5
          md:max-w-0
          md:overflow-hidden
          md:transition-[max-width]
          md:text-2
          md:group-hover/navigation-button:max-w-xs
        `}
      >
        <span className="align-middle md:whitespace-nowrap md:pl-2">
          {label}
        </span>
      </span>
      {isTablet && hasSecondLevel && (
        <CaretDown
          className={clsx('transition-transform', {
            'rotate-180': isActive && isExpanded,
          })}
          size={12}
        />
      )}
    </button>
  );
};

NavigationSidebarButton.displayName = displayName;

export default NavigationSidebarButton;
