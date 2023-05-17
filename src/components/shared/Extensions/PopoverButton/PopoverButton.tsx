import clsx from 'clsx';
import React, { FC } from 'react';
import { useHover } from '~hooks/useHover';
import { PopoverButtonProps } from './types';

const displayName = 'Extensions.PopoverButton';

const PopoverButton: FC<PopoverButtonProps> = ({ isDisabled, type }) => {
  const { isHovered, toggleHover } = useHover();

  return (
    <button
      type="button"
      aria-label="popover-button"
      className={clsx(`bg-base-white rounded-sm capitalize border text-xs font-medium px-2 py-1 transition-all`, {
        'border border-gray-300 text-gray-300 cursor-not-allowed': isDisabled,
        'text-blue-400 border-blue-400': isHovered && !isDisabled,
        'border-gray-100 text-gray-700': !isHovered,
      })}
      onMouseEnter={() => toggleHover(true)}
      onMouseLeave={() => toggleHover(false)}
    >
      {type}
    </button>
  );
};

PopoverButton.displayName = displayName;

export default PopoverButton;
