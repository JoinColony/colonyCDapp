import { CaretDown } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';

import { useMobile } from '~hooks/index.ts';

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
  const isMobile = useMobile();

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
          sm:w-auto
          sm:justify-center
          sm:gap-0
          sm:rounded-lg
          sm:transition-all
        `,
        {
          'text-blue-400 sm:bg-gray-900 sm:text-base-white':
            isActive && !isMobile,
          'text-gray-900 sm:hover:bg-gray-900 sm:hover:text-base-white':
            !isActive && !isHighlighted,
          'bg-blue-100 text-blue-400': isHighlighted,
        },
      )}
      {...rest}
    >
      {!isMobile && <Icon size={22} />}
      <span
        className={`
          heading-5
          sm:max-w-0
          sm:overflow-hidden
          sm:transition-[max-width]
          sm:text-2
          sm:group-hover/navigation-button:max-w-xs
        `}
      >
        <span className="align-middle sm:whitespace-nowrap sm:pl-2">
          {label}
        </span>
      </span>
      {isMobile && hasSecondLevel && (
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
