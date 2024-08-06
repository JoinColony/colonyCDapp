import clsx from 'clsx';
import React, { type FC } from 'react';

import { usePageLayoutContext } from '~context/PageLayoutContext/PageLayoutContext.ts';
import { formatText } from '~utils/intl.ts';

import { type MobileColonyPageSidebarToggleProps } from './types.ts';

const displayName = 'v5.shared.Navigation.MobileColonyPageSidebarToggle';

const MobileColonyPageSidebarToggle: FC<MobileColonyPageSidebarToggleProps> = ({
  label,
  className,
}) => {
  const { showTabletSidebar, toggleTabletSidebar, setShowTabletColonyPicker } =
    usePageLayoutContext();

  const onClick = () => {
    setShowTabletColonyPicker(false);
    toggleTabletSidebar();
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(className, 'flex items-center gap-2 p-1', {
        'text-blue-400': showTabletSidebar,
      })}
    >
      <span className="relative block h-2.5 w-3.5">
        <span
          className={clsx(
            'absolute left-1/2 top-1/2 h-px w-full -translate-x-1/2 rounded-full bg-current transition-all',
            {
              '-translate-y-[5px]': !showTabletSidebar,
              '-translate-y-1/2 rotate-45': showTabletSidebar,
            },
          )}
        />
        <span
          className={clsx(
            `
              absolute
              left-1/2
              top-1/2
              h-px
              w-full
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-current
              transition-all
            `,
            {
              'w-0 opacity-0': showTabletSidebar,
              'opacity-1 w-full': !showTabletSidebar,
            },
          )}
        />
        <span
          className={clsx(
            'absolute left-1/2 top-1/2 h-px w-full -translate-x-1/2 rounded-full bg-current transition-all',
            {
              'translate-y-[4px]': !showTabletSidebar, // it doesn't work with rems or 1
              '-translate-y-1/2 -rotate-45': showTabletSidebar,
            },
          )}
        />
      </span>
      {label && (
        <span className="inline-flex text-current text-2">
          {formatText(label)}
        </span>
      )}
    </button>
  );
};

MobileColonyPageSidebarToggle.displayName = displayName;

export default MobileColonyPageSidebarToggle;
