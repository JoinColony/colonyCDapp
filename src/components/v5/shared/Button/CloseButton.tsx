/* eslint-disable react/button-has-type */
import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import { CloseButtonProps } from './types';
import SpinnerLoader from '~shared/Preloaders/SpinnerLoader';
import styles from './CloseButton.module.css';
import Icon from '~shared/Icon';

const displayName = 'v5.Button.CloseButton';

const CloseButton: FC<CloseButtonProps> = ({
  disabled = false,
  loading = false,
  title,
  type = 'button',
  ariaLabel,
  iconSize = 'extraTiny',
  setTriggerRef,
  className,
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
          className={clsx(styles.closeButton, className, {
            'pointer-events-none': disabled,
          })}
          disabled={disabled || loading}
          aria-label={ariaLabelText}
          aria-busy={loading}
          title={titleText}
          type={type}
          ref={setTriggerRef}
          {...rest}
        >
          <Icon name="close" appearance={{ size: iconSize }} />
        </button>
      )}
    </>
  );
};

CloseButton.displayName = displayName;

export default CloseButton;
