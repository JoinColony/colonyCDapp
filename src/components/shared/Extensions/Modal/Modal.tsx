import React, { FC, PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';
import Icon from '~shared/Icon';
import { ModalProps } from './types';
import ModalBase from './ModalBase';
import styles from './Modal.module.css';

const displayName = 'Extensions.Modal';

const Modal: FC<PropsWithChildren<ModalProps>> = ({ title, children, icon, onClose, isWarning = false, ...props }) => {
  const { formatMessage } = useIntl();

  const titleText = typeof title == 'string' ? title : title && formatMessage(title);

  return (
    <ModalBase onRequestClose={onClose} {...props}>
      <div className="flex mb-4 relative">
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
          *
        </button>
      </div>
      <div className={styles.inner}>
        <h3 className="font-xl font-semibold mb-1.5">{titleText}</h3>
        {children}
      </div>
    </ModalBase>
  );
};

Modal.displayName = displayName;

export default Modal;
