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
    className={clsx(
      className,
      'group absolute bottom-0 top-0 z-10 flex items-center from-base-white from-20% px-5',
    )}
    disabled={disabled}
  >
    <span className="rounded-full border border-gray-200 bg-base-white p-1 opacity-0 transition-opacity group-hover:opacity-100">
      {children}
    </span>
  </button>
);
