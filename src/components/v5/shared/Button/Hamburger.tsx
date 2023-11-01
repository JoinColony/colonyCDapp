/* eslint-disable react/button-has-type */
import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import { HamburgerProps } from './types';
import SpinnerLoader from '~shared/Preloaders/SpinnerLoader';
import styles from './Hamburger.module.css';
import Icon from '~shared/Icon';

const displayName = 'v5.Button.Hamburger';

const Hamburger: FC<HamburgerProps> = ({
  disabled = false,
  loading = false,
  title,
  type = 'button',
  ariaLabel,
  iconName = 'list',
  iconSize = 'extraTiny',
  setTriggerRef,
  isOpened,
  ...rest
}) => {
  const { formatMessage } = useIntl();

  const titleText =
    typeof title === 'string' ? title : title && formatMessage(title);

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
            'text-1',
            `${
              isOpened
                ? 'border-base-white hover:border-base-white text-gray-400'
                : 'border-gray-200 hover:border-blue-400 text-gray-700'
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
        </button>
      )}
    </>
  );
};

Hamburger.displayName = displayName;

export default Hamburger;
