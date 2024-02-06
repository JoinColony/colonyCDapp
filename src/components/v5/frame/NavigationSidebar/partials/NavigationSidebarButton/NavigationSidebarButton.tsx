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
          w-full
          md:w-auto
          text-left
          md:rounded-lg
          px-2.5
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
          'text-blue-400 md:text-base-white md:bg-gray-900':
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
          md:text-2
          md:max-w-0
          md:overflow-hidden
          md:group-hover/navigation-button:max-w-xs
          md:transition-[max-width]
        `}
      >
        <span className="align-middle md:pl-2 md:whitespace-nowrap">
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
