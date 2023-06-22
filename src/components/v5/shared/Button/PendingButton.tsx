/* eslint-disable react/button-has-type */
import React, { FC, PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import { PendingButtonProps } from './types';
import SpinnerLoader from '~shared/Preloaders/SpinnerLoader';
import styles from './PendingButton.module.css';
import Icon from '~shared/Icon';

const displayName = 'v5.Button.PendingButton';

const Button: FC<PropsWithChildren<PendingButtonProps>> = ({
  children,
  disabled = false,
  loading = false,
  title,
  text,
  textValues,
  type = 'button',
  className,
  ariaLabel,
  isPending,
  setTriggerRef,
  ...rest
}) => {
  const { formatMessage } = useIntl();

  const titleText =
    typeof title === 'string' ? title : title && formatMessage(title);
  const buttonText =
    typeof text === 'string' ? text : text && formatMessage(text, textValues);
  const ariaLabelText =
    typeof ariaLabel === 'string'
      ? ariaLabel
      : ariaLabel && formatMessage(ariaLabel);

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
              'pointer-events-none': disabled,
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
          {isPending && (
            <span className="flex shrink-0 ml-1.5">
              <Icon
                name="spinner-gap"
                className={`w-[0.8125rem] h-[0.8125rem] ${
                  isPending ? 'animate-spin' : 'animate-none'
                }`}
                appearance={{ size: 'tiny' }}
              />
            </span>
          )}
        </button>
      )}
    </>
  );
};

Button.displayName = displayName;

export default Button;
