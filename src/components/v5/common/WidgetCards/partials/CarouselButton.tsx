import clsx from 'clsx';
import React, { type FC } from 'react';

interface CarouselButtonProps {
  onClick: () => void;
  disabled: boolean;
  ariaLabel: string;
  children: React.ReactNode;
}

export const CarouselButton: FC<CarouselButtonProps> = ({
  onClick,
  disabled,
  ariaLabel,
  children,
}) => (
  <button
    onClick={onClick}
    type="button"
    className={clsx(
      'transition-all duration-300 ease-in-out',
      disabled ? 'opacity-0' : 'opacity-100',
    )}
    aria-label={ariaLabel}
    disabled={disabled}
  >
    {children}
  </button>
);
