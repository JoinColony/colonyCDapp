import clsx from 'clsx';
import React, { type ButtonHTMLAttributes, type FC } from 'react';

export const CarouselButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  onClick,
  disabled,
  className,
  children,
}) => (
  <button
    onClick={onClick}
    type="button"
    className={clsx(className, disabled ? 'opacity-20' : 'opacity-100')}
    disabled={disabled}
  >
    {children}
  </button>
);
