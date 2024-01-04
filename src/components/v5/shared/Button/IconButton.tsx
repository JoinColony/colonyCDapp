/* eslint-disable react/button-has-type */
import clsx from 'clsx';
import React, { FC, PropsWithChildren } from 'react';

import SpinnerLoader from '~shared/Preloaders/SpinnerLoader';
import { formatText } from '~utils/intl';

import { IconButtonProps } from './types';

import styles from './TxButton.module.css';

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
            className,
            styles.pending,
            'flex items-center justify-center font-medium transition-all duration-normal',
            {
              'rounded-lg': rounded === 's',
              'rounded-full': rounded === 'l',
              'pointer-events-none': disabled,
              'w-full': isFullSize,
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
