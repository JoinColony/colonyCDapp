import clsx from 'clsx';
import React, { FC } from 'react';
import { useHover } from '~hooks/useHover';
import Icon from '~shared/Icon';
import { PopoverButtonProps } from './types';

const displayName = 'Extensions.PopoverButton';

const PopoverButton: FC<PopoverButtonProps> = ({ isDisabled, isFullWidth, type }) => {
  const { isHovered, toggleHover } = useHover();
  const iconName =
    (type === 'view' && 'eye') || (type === 'deposit' && 'arrow-circle-down-right') || 'arrow-circle-up-right';

  return (
    <button
      type="button"
      aria-label="popover-button"
      className={clsx(
        `flex items-center bg-base-white rounded-sm capitalize border text-xs font-medium px-2 py-1 transition-all`,
        {
          'border border-gray-300 text-gray-300 cursor-not-allowed [&>i>svg]:fill-gray-300': isDisabled,
          'text-blue-400 border-blue-400 [&>i>svg]:fill-blue-400': isHovered && !isDisabled,
          'border-gray-100 text-gray-700': !isHovered,
          'w-full justify-center': isFullWidth,
        },
      )}
      onMouseEnter={() => toggleHover(true)}
      onMouseLeave={() => toggleHover(false)}
    >
      <Icon name={iconName} appearance={{ size: 'extraTiny' }} />
      <span className="ml-1">{type}</span>
    </button>
  );
};

PopoverButton.displayName = displayName;

export default PopoverButton;
