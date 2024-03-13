import clsx from 'clsx';
import React, { type FC } from 'react';

import { type HamburgerButtonProps } from './types.ts';

const HamburgerButton: FC<HamburgerButtonProps> = ({
  isOpen,
  onClick,
  label,
  className,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(className, 'flex items-center gap-1.5 p-1', {
        'text-blue-400': isOpen,
        'text-gray-900': !isOpen,
      })}
    >
      <span className="relative block h-2.5 w-3.5">
        <span
          className={clsx(
            'absolute left-1/2 top-1/2 h-px w-full -translate-x-1/2 rounded-full bg-current transition-all',
            {
              '-translate-y-[5px]': !isOpen, // it doesn't work with rems
              '-translate-y-1/2 rotate-45': isOpen,
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
              'w-0 opacity-0': isOpen,
              'opacity-1 w-full': !isOpen,
            },
          )}
        />
        <span
          className={clsx(
            'absolute left-1/2 top-1/2 h-px w-full -translate-x-1/2 rounded-full bg-current transition-all',
            {
              'translate-y-[4px]': !isOpen, // it doesn't work with rems or 1
              '-translate-y-1/2 -rotate-45': isOpen,
            },
          )}
        />
      </span>
      {label && (
        <span className="inline-flex text-current text-2">{label}</span>
      )}
    </button>
  );
};

export default HamburgerButton;
