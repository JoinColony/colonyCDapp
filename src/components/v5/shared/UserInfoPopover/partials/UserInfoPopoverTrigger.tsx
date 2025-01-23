import { CircleWavyCheck } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { forwardRef, type PropsWithChildren } from 'react';

const displayName = 'v5.UserInfoPopover.partials.UserInfoPopoverTrigger';

interface UserInfoPopoverTriggerProps extends PropsWithChildren {
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  className?: string;
  isLoading?: boolean;
  showVerifiedBadge?: boolean;
}

const UserInfoPopoverTrigger = forwardRef<
  HTMLButtonElement,
  UserInfoPopoverTriggerProps
>(
  (
    {
      onClick,
      onMouseEnter,
      onMouseLeave,
      className,
      isLoading,
      showVerifiedBadge,
      children,
    },
    ref,
  ) => {
    const handleClick = (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
      event.preventDefault();
      event.stopPropagation();
      onClick();
    };

    return (
      <button
        ref={ref}
        onClick={handleClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        type="button"
        className={clsx(
          'inline-flex flex-shrink-0 items-center transition-all duration-normal hover:text-blue-400',
          className,
          {
            skeleton: isLoading,
          },
        )}
        disabled={isLoading}
      >
        {children}

        {showVerifiedBadge && (
          <CircleWavyCheck
            size={14}
            className="ml-1 flex-shrink-0 text-blue-400"
          />
        )}
      </button>
    );
  },
);

UserInfoPopoverTrigger.displayName = displayName;

export default UserInfoPopoverTrigger;
