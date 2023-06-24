/* eslint-disable react/button-has-type */
import React, { FC, PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import { HamburgerProps } from './types';
import SpinnerLoader from '~shared/Preloaders/SpinnerLoader';
import styles from './Hamburger.module.css';
import Icon from '~shared/Icon';

const displayName = 'v5.Button.Hamburger';

const Hamburger: FC<PropsWithChildren<HamburgerProps>> = ({
  children,
  disabled = false,
  loading = false,
  title,
  text,
  textValues,
  type = 'button',
  ariaLabel,
  iconName,
  iconSize = 'tiny',
  setTriggerRef,
  isOpened,
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
            styles.hamburger,
            `${
              isOpened
                ? 'border-base-white hover:border-base-white'
                : 'border-gray-200 hover:border-blue-400'
            }`,
            {
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
          {iconName && <Icon name={iconName} appearance={{ size: iconSize }} />}
          {(buttonText || children) && (
            <>
              {iconName ? (
                <span className="ml-2">{buttonText || children}</span>
              ) : (
                buttonText || children
              )}
            </>
          )}
        </button>
      )}
    </>
  );
};

Hamburger.displayName = displayName;

export default Hamburger;
