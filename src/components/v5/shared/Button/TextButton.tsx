import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';

import SpinnerLoader from '~shared/Preloaders/SpinnerLoader.tsx';

import { type TextButtonProps } from './types.ts';

import styles from './TextButton.module.css';

const displayName = 'v5.Button.TextButton';

const TextButton: FC<PropsWithChildren<TextButtonProps>> = ({
  mode = 'default',
  children,
  disabled = false,
  loading = false,
  title,
  text,
  textValues,
  type = 'button',
  icon: Icon,
  iconSize,
  ariaLabel,
  setTriggerRef,
  className,
  isErrorColor,
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
            [styles.textButton],
            'font-medium transition-all flex items-center duration-normal',
            {
              'text-sm text-gray-700': mode === 'default',
            },
            {
              'text-md': mode === 'medium',
            },
            {
              [styles.underlined]: mode === 'underlined',
              'pointer-events-none': disabled,
              'disabled:text-gray-400': !isErrorColor,
              'text-negative-400': isErrorColor,
            },
          )}
          disabled={disabled || loading}
          aria-label={ariaLabelText}
          aria-busy={loading}
          title={titleText}
          /* eslint-disable react/button-has-type */
          type={type}
          /* eslint-enable react/button-has-type */
          ref={setTriggerRef}
          {...rest}
        >
          {Icon && (
            <span className="flex shrink-0 mr-2">
              <Icon size={iconSize} />
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
