import clsx from 'clsx';
import React, { useEffect, type FC, type PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';

import Button, { CloseButton } from '~v5/shared/Button/index.ts';

import ModalBase from './ModalBase.tsx';
import { type ModalProps } from './types.ts';

const displayName = 'v5.Modal';

const Modal: FC<PropsWithChildren<ModalProps>> = ({
  title,
  subTitle,
  children,
  icon: Icon,
  onClose,
  onConfirm,
  isWarning = false,
  isFullOnMobile = true,
  confirmMessage,
  closeMessage,
  disabled,
  buttonMode = 'secondarySolid',
  isTopSectionWithBackground,
  shouldShowHeader = false,
  isOpen,
  ...props
}) => {
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (
      isOpen &&
      shouldShowHeader &&
      !document.body.classList.contains('show-header-in-modal')
    ) {
      document.body.classList.add('show-header-in-modal');
    }

    return () => {
      document.body.classList.remove('show-header-in-modal');
    };
  }, [isOpen, shouldShowHeader]);

  return (
    <ModalBase
      onRequestClose={onClose}
      isOpen={isOpen}
      {...{ isFullOnMobile, ...props }}
      isTopSectionWithBackground={isTopSectionWithBackground}
    >
      {Icon && (
        <span
          className={clsx(
            'mb-4 flex h-[2.5rem] w-[2.5rem] flex-shrink-0 items-center justify-center rounded border border-gray-200 shadow-content',
            {
              'border-negative-200 text-negative-400': isWarning,
            },
          )}
        >
          <Icon size={24} />
        </span>
      )}
      <CloseButton
        aria-label={formatMessage({ id: 'ariaLabel.closeModal' })}
        title={formatMessage({ id: 'button.cancel' })}
        onClick={onClose}
        className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
      />
      <div
        className={clsx(
          'flex w-full flex-grow flex-col [-webkit-overflow-scrolling:touch]',
          {
            'pb-6 pr-6': !isTopSectionWithBackground,
          },
        )}
      >
        <div className="flex flex-grow flex-col">
          {title && <h4 className="mb-2 heading-5">{title}</h4>}
          {subTitle && <p className="text-md text-gray-600">{subTitle}</p>}
          {children}
        </div>
        {(closeMessage || confirmMessage) && (
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row">
            {closeMessage && (
              <Button mode="primaryOutline" isFullSize onClick={onClose}>
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
