import { X } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';
import { useIntl } from 'react-intl';

import SpinnerLoader from '~shared/Preloaders/SpinnerLoader.tsx';

import { type CloseButtonProps } from './types.ts';

import styles from './CloseButton.module.css';

const displayName = 'v5.Button.CloseButton';

const CloseButton: FC<CloseButtonProps> = ({
  disabled = false,
  loading = false,
  title,
  type = 'button',
  ariaLabel,
  setTriggerRef,
  className = 'text-gray-400 hover:text-gray-600',
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
          /* eslint-disable react/button-has-type */
          type={type}
          /* eslint-enable react/button-has-type */
          ref={setTriggerRef}
          {...rest}
        >
          <span className="flex text-sm">
            <X size={12} />
          </span>
        </button>
      )}
    </>
  );
};

CloseButton.displayName = displayName;

export default CloseButton;
