import clsx from 'clsx';
import React, { FC } from 'react';
import { HamburgerButtonProps } from './types';

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
      <span className="relative h-[10px] w-[14px] block">
        <span
          className={clsx(
            'absolute top-1/2 left-1/2 -translate-x-1/2 h-[1px] rounded-full w-full bg-current transition-all',
            {
              '-translate-y-[5px]': !isOpen,
              'rotate-45 -translate-y-1/2': isOpen,
            },
          )}
        />
        <span
          className={clsx(
            `
              absolute
              top-1/2
              left-1/2
              -translate-x-1/2
              -translate-y-1/2
              h-[1px]
              rounded-full
              w-full
              bg-current
              transition-all
            `,
            {
              'opacity-0 w-0': isOpen,
              'opacity-1 w-full': !isOpen,
            },
          )}
        />
        <span
          className={clsx(
            'absolute top-1/2 left-1/2 -translate-x-1/2 h-[1px] rounded-full w-full bg-current transition-all',
            {
              'translate-y-[4px]': !isOpen,
              '-rotate-45 -translate-y-1/2': isOpen,
            },
          )}
        />
      </span>
      {label && (
        <span className="text-2 text-current inline-flex">{label}</span>
      )}
    </button>
  );
};

export default HamburgerButton;
