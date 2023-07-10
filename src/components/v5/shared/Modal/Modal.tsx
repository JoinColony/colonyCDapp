import React, { FC, PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import Button, { CloseButton } from '~v5/shared/Button';
import Icon from '~shared/Icon';
import { ModalProps } from './types';
import ModalBase from './ModalBase';
import styles from './Modal.module.css';

const displayName = 'v5.Modal';

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
  isTopContributorType,
  ...props
}) => {
  const { formatMessage } = useIntl();

  return (
    <ModalBase
      onRequestClose={onClose}
      {...{ isFullOnMobile, ...props }}
      isTopSectionWithBackground={isTopContributorType}
    >
      {icon && (
        <span
          className={clsx(styles.icon, 'border-gray-200', {
            'border-red-200 text-red-400': isWarning,
          })}
        >
          <Icon appearance={{ size: 'extraSmall' }} name={icon} />
        </span>
      )}
      <CloseButton
        aria-label={formatMessage({ id: 'ariaLabel.closeModal' })}
        title={formatMessage({ id: 'button.cancel' })}
        onClick={onClose}
        className={styles.closeIcon}
      />
      <div
        className={clsx(styles.inner, {
          'pb-6 pr-6': !isTopContributorType,
        })}
      >
        <div className="flex-grow">
          {title && <h4 className="heading-5 mb-2">{title}</h4>}
          {subTitle && <p className="text-gray-600 text-md">{subTitle}</p>}
          {children}
        </div>
        {(closeMessage || confirmMessage) && (
          <div className="flex flex-col-reverse gap-3 mt-8 sm:flex-row">
            {closeMessage && (
              <Button mode="primaryOutlineFull" isFullSize onClick={onClose}>
                {closeMessage}
              </Button>
            )}
            {confirmMessage && (
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
            )}
          </div>
        )}
      </div>
    </ModalBase>
  );
};

Modal.displayName = displayName;

export default Modal;
