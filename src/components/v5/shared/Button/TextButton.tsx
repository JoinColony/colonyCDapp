/* eslint-disable react/button-has-type */
import React, { FC, PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import { TextButtonProps } from './types';
import SpinnerLoader from '~shared/Preloaders/SpinnerLoader';
import styles from './TextButton.module.css';
import Icon from '~shared/Icon';

const displayName = 'v5.Button.TextButton';

const TextButton: FC<PropsWithChildren<TextButtonProps>> = ({
  mode = 'defalt',
  children,
  disabled = false,
  loading = false,
  title,
  text,
  textValues,
  type = 'button',
  iconName,
  iconSize,
  ariaLabel,
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
            [styles.textButton],
            'font-medium transition-all flex items-center duration-normal',
            {
              'text-sm': mode === 'default',
            },
            {
              'text-md': mode === 'medium',
            },
            {
              [styles.underlined]: mode === 'underlined',
              'pointer-events-none': disabled,
            },
          )}
          disabled={disabled || loading}
          aria-label={ariaLabelText}
          aria-busy={loading}
          title={titleText}
          type={type}
          ref={setTriggerRef}
          {...rest}
        >
          {iconName && (
            <span className="flex shrink-0 mr-2">
              <Icon name={iconName} appearance={{ size: iconSize }} />
            </span>
          )}
          {buttonText || children}
        </button>
      )}
    </>
  );
};

TextButton.displayName = displayName;

export default TextButton;
