/* eslint-disable react/button-has-type */

import React, { FC, PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';
import { ButtonProps } from './types';
import SpinnerLoader from '~shared/Preloaders/SpinnerLoader';
import styles from './Button.module.css';
import Icon from '~shared/Icon';

const displayName = 'Extensions.Button';

const Button: FC<PropsWithChildren<ButtonProps>> = ({
  mode = 'primarySolid',
  children,
  disabled = false,
  loading = false,
  title,
  text,
  textValues,
  type = 'button',
  className,
  ariaLabel,
  isFullSize,
  isLoading,
  ...rest
}) => {
  const { formatMessage } = useIntl();

  const titleText = typeof title === 'string' ? title : title && formatMessage(title);
  const buttonText = typeof text === 'string' ? text : text && formatMessage(text, textValues);
  const ariaLabelText = typeof ariaLabel === 'string' ? ariaLabel : ariaLabel && formatMessage(ariaLabel);

  return (
    <>
      {loading ? (
        <SpinnerLoader appearance={{ size: 'medium' }} />
      ) : (
        <button
          className={clsx(
            'flex items-center justify-center font-medium transition-all duration-normal',
            {
              [styles.primarySolid]: mode === 'primarySolid',
              [styles.primaryOutline]: mode === 'primaryOutline',
              [styles.secondarySolid]: mode === 'secondarySolid',
              [styles.textButton]: mode === 'textButton',
              [styles.pending]: mode === 'pending',
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
          {...rest}
        >
          {buttonText || children}
          {mode === 'pending' && (
            <Icon
              name="spinner-gap"
              className={`ml-[0.59375rem] w-[13px] h-[13px] ${isLoading ? 'animate-spin' : 'animate-none'}`}
            />
          )}
        </button>
      )}
    </>
  );
};

Button.displayName = displayName;

export default Button;
