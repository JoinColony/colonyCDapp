/* eslint-disable react/button-has-type */

import React, { PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';
import { TextButtonProps } from './types';

const displayName = 'TextButton';

const TextButton: React.FC<PropsWithChildren<TextButtonProps>> = ({
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
    <button
      className={clsx(
        'text-sm font-medium text-gray-900 hover:text-blue-400 transition-all duration-normal',
        {
          'text-gray-400 pointer-events-none': disabled,
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
  );
};

TextButton.displayName = displayName;

export default TextButton;
