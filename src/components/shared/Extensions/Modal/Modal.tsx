import React, { FC, PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import Icon from '~shared/Icon';
import { ModalProps } from './types';
import ModalBase from './ModalBase';
import styles from './Modal.module.css';
import Button from '~shared/Extensions/Button';

const displayName = 'Extensions.Modal';

const Modal: FC<PropsWithChildren<ModalProps>> = ({
  title,
  subTitle,
  children,
  icon,
  onClose,
  onConfirm,
  isWarning = false,
  isFullOnMobile = true,
  confirmMessage,
  closeMessage,
  disabled,
  buttonMode = 'secondarySolid',
  ...props
}) => {
  const { formatMessage } = useIntl();

  return (
    <ModalBase onRequestClose={onClose} {...{ isFullOnMobile, ...props }}>
      {icon && (
        <span
          className={clsx(styles.icon, 'border-gray-200', {
            'border-red-200 text-red-400': isWarning,
          })}
        >
          <Icon appearance={{ size: 'small' }} name={icon} />
        </span>
      )}
      <button
        aria-label={formatMessage({ id: 'ariaLabel.closeModal' })}
        type="button"
        className={styles.closeIcon}
        onClick={onClose}
      >
        <Icon
          appearance={{ size: 'extraTiny' }}
          name="close"
          title={formatMessage({ id: 'button.cancel' })}
        />
      </button>

      <div className={styles.inner}>
        {title && <h4 className="text-lg font-semibold mb-2">{title}</h4>}
        {subTitle && <p className="text-gray-600 text-md">{subTitle}</p>}
        {children}
        <div className="flex gap-3 mt-8">
          <Button mode="primaryOutline" isFullSize onClick={onClose}>
            {closeMessage}
          </Button>
          <Button
            mode={buttonMode}
            isFullSize
            disabled={disabled}
            onClick={() => {
              onConfirm?.();
              onClose();
            }}
          >
            {confirmMessage}
          </Button>
        </div>
      </div>
    </ModalBase>
  );
};

Modal.displayName = displayName;

export default Modal;
