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
      'group absolute bottom-0 top-0 z-10 flex items-center px-5  opacity-0 transition-opacity hover:opacity-100',
    )}
    disabled={disabled}
  >
    <span className="rounded-full border border-gray-200 bg-base-white p-1 transition-colors hover:border-blue-400 hover:text-blue-400 ">
      {children}
    </span>
  </button>
);
