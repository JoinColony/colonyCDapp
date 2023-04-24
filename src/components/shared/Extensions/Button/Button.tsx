/* eslint-disable react/button-has-type */

import React, { FC, PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';
import { ButtonProps } from './types';
import SpinnerLoader from '~shared/Preloaders/SpinnerLoader';
import styles from './Button.module.css';

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
  ...rest
}) => {
  const { formatMessage } = useIntl();

  const titleText = typeof title == 'string' ? title : title && formatMessage(title);
  const buttonText = typeof text == 'string' ? text : text && formatMessage(text, textValues);

  return (
    <>
      {loading ? (
        <SpinnerLoader appearance={{ size: 'medium' }} />
      ) : (
        <button
          className={clsx('flex items-center font-medium transition-all duration-normal', {
            [styles.primarySolid]: mode === 'primarySolid',
            [styles.primaryOutline]: mode === 'primaryOutline',
            [styles.textButton]: mode === 'textButton',
            'pointer-events-none': disabled,
          })}
          disabled={disabled || loading}
          aria-busy={loading}
          title={titleText}
          type={type}
          {...rest}
        >
          {buttonText || children}
        </button>
      )}
    </>
  );
};

Button.displayName = displayName;

export default Button;
