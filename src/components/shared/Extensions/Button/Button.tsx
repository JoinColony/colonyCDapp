/* eslint-disable react/button-has-type */

import React, { PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';
import { ButtonProps } from './types';
import SpinnerLoader from '~shared/Preloaders/SpinnerLoader';
import styles from './Button.css';

const displayName = 'Button';

const Button: React.FC<PropsWithChildren<ButtonProps>> = ({
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

  const titleText =
    typeof title == 'string' ? title : title && formatMessage(title);
  const buttonText =
    typeof text == 'string' ? text : text && formatMessage(text, textValues);

  return (
    <>
      {loading ? (
        <SpinnerLoader appearance={{ size: 'medium' }} />
      ) : (
        <button
          className={clsx(
            'flex text-md font-medium px-4 py-2.5 rounded-lg h-[2.5rem] transition-all duration-normal',
            {
              [styles.primarySolid]: mode === 'primarySolid',
              [styles.primaryOutline]: mode === 'primaryOutline',
              'pointer-events-none': disabled,
            },
          )}
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
