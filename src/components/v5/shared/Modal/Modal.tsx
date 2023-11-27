import React, { FC, PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import Button, { CloseButton } from '~v5/shared/Button';
import Icon from '~shared/Icon';
import { ModalProps } from './types';
import ModalBase from './ModalBase';

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
  isTopSectionWithBackground,
  ...props
}) => {
  const { formatMessage } = useIntl();

  return (
    <ModalBase
      onRequestClose={onClose}
      {...{ isFullOnMobile, ...props }}
      isTopSectionWithBackground={isTopSectionWithBackground}
    >
      {icon && (
        <span
          className={clsx(
            'flex items-center justify-center w-[2.5rem] h-[2.5rem] rounded border shadow-content mb-4 border-gray-200 flex-shrink-0',
            {
              'border-red-200 text-negative-400': isWarning,
            },
          )}
        >
          <Icon className="!w-6 !h-6" name={icon} />
        </span>
      )}
      <CloseButton
        aria-label={formatMessage({ id: 'ariaLabel.closeModal' })}
        title={formatMessage({ id: 'button.cancel' })}
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 absolute top-4 right-4"
      />
      <div
        className={clsx(
          'flex flex-col w-full flex-grow [-webkit-overflow-scrolling:touch]',
          {
            'pb-6 pr-6': !isTopSectionWithBackground,
          },
        )}
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
