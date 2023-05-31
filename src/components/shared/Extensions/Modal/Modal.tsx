import React, { FC, PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import Icon from '~shared/Extensions/Icon';
import { ModalProps } from './types';
import ModalBase from './ModalBase';
import styles from './Modal.module.css';

const displayName = 'Extensions.Modal';

const Modal: FC<PropsWithChildren<ModalProps>> = ({
  children,
  icon,
  onClose,
  isWarning = false,
  isFullOnMobile = true,
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
        aria-label={formatMessage({ id: 'shared.modal.buttonCloseAriaLabel' })}
        type="button"
        className={styles.closeIcon}
        onClick={onClose}
      >
        <Icon
          appearance={{ size: 'extraTiny' }}
          name="close"
          title={formatMessage({ id: 'shared.modal.buttonCancel' })}
        />
      </button>

      <div className={styles.inner}>{children}</div>
    </ModalBase>
  );
};

Modal.displayName = displayName;

export default Modal;
