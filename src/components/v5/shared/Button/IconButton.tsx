/* eslint-disable react/button-has-type */
import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';

import { usePageThemeContext } from '~context/PageThemeContext/PageThemeContext.ts';
import SpinnerLoader from '~shared/Preloaders/SpinnerLoader.tsx';
import { formatText } from '~utils/intl.ts';

import { type IconButtonProps } from './types.ts';

const displayName = 'v5.Button.IconButton';

const IconButton: FC<PropsWithChildren<IconButtonProps>> = ({
  children,
  disabled = false,
  loading = false,
  type = 'button',
  text,
  title,
  ariaLabel,
  textValues,
  className,
  icon,
  setTriggerRef,
  rounded = 'l',
  isFullSize,
  ...rest
}) => {
  const { isDarkMode } = usePageThemeContext();
  const titleText = title ? formatText(title) : undefined;
  const buttonText = text ? formatText(text, textValues) : undefined;
  const ariaLabelText = ariaLabel ? formatText(ariaLabel) : undefined;

  return (
    <>
      {loading ? (
        <SpinnerLoader appearance={{ size: 'medium' }} />
      ) : (
        <button
          className={clsx(
            'flex min-w-[6.25rem] items-center justify-center bg-blue-400 px-3.5 py-2.5 text-sm font-medium transition-all duration-normal hover:bg-blue-300 disabled:bg-gray-300',
            {
              'rounded-lg': rounded === 's',
              'rounded-full': rounded === 'l',
              'pointer-events-none': disabled,
              'w-full': isFullSize,
              'text-base-white': !isDarkMode,
              'text-gray-900': isDarkMode,
            },
            className,
          )}
          disabled={disabled || loading}
          aria-label={ariaLabelText}
          aria-busy={loading}
          title={titleText}
          type={type}
          ref={setTriggerRef}
          {...rest}
        >
          {buttonText || children}
          {icon}
        </button>
      )}
    </>
  );
};

IconButton.displayName = displayName;

export default IconButton;
