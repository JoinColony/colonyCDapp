import clsx from 'clsx';
import React, { type ButtonHTMLAttributes, type FC } from 'react';

export const CarouselButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  onClick,
  disabled,
  children,
}) => (
  <button
    onClick={onClick}
    type="button"
    className={clsx(disabled ? 'opacity-0' : 'opacity-100')}
    disabled={disabled}
  >
    {children}
  </button>
);
