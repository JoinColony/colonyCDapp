/* eslint-disable react/button-has-type */

import React from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';
import { ButtonProps } from './types';
import SpinnerLoader from '~shared/Preloaders/SpinnerLoader';

const displayName = 'Button';

const Button = ({
  mode = 'primarySolid',
  children,
  disabled = false,
  loading = false,
  title,
  text,
  textValues,
  type = 'button',
  ...rest
}: ButtonProps) => {
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
            'flex text-md font-medium px-16 py-10 rounded-lg min-h-[2.5rem] transition-all duration-normal',
            {
              'bg-blue-400 text-base-white hover:bg-blue-300':
                mode === 'primarySolid',
              'bg-gray-300': mode === 'primarySolid' && disabled,
              'bg-base-white text-gray-700 border border-gray-300 hover:bg-blue-400 hover:border-blue-400 hover:text-base-white':
                mode === 'primaryOutline',
              'text-gray-300 border-gray-300':
                mode === 'primaryOutline' && disabled,
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
