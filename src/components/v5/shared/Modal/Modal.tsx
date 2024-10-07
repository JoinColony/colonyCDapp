import clsx from 'clsx';
import React, { useRef, type FC, type PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';

import { useAddClassToElement } from '~hooks/useAddClassToElement.ts';
import { useResize } from '~hooks/useResize.ts';
import { addClassToElement } from '~utils/css/addClassToElement.ts';
import { isElementOverflowingContainerY } from '~utils/css/isElementOverflowingContainerY.ts';
import Button, { CloseButton } from '~v5/shared/Button/index.ts';

import ModalBase from './ModalBase.tsx';
import { type ModalProps } from './types.ts';

import styles from './Modal.module.css';

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
  withPadding = true,
  withBorder,
  withPaddingBottom,
  shouldShowHeader,
  isOpen,
  ...props
}) => {
  const { formatMessage } = useIntl();

  useAddClassToElement({
    shouldAddClass: isOpen && !!shouldShowHeader,
    className: 'show-header-in-modal',
    element: document.body,
  });
  const contentRef = useRef<HTMLDivElement>(null);

  const addOverflowContentClass = () => {
    const showScrollbar = isElementOverflowingContainerY(contentRef.current);
    if (showScrollbar) {
      addClassToElement(contentRef.current, '-mr-1.5');
    }
  };

  useResize(addOverflowContentClass);

  return (
    <ModalBase
      onRequestClose={onClose}
      isOpen={isOpen}
      {...{ isFullOnMobile, ...props }}
      withBorder={withBorder}
      withPadding={withPadding}
      withPaddingBottom={withPaddingBottom}
    >
      <div
        className={`${styles.modalContentWrapper} overflow-y-auto overflow-x-hidden`}
      >
        <div ref={contentRef} className="relative">
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
            className={clsx(
              `absolute right-4 text-gray-400 hover:text-gray-600`,
              {
                'top-6': !withPadding,
                '-top-2': withPadding,
              },
            )}
          />
          <div
            className={clsx(
              'flex w-full flex-grow flex-col [-webkit-overflow-scrolling:touch]',
              {
                'pr-6': withPadding,
                'pb-6': withPadding && !withPaddingBottom,
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
        </div>
      </div>
    </ModalBase>
  );
};

Modal.displayName = displayName;

export default Modal;
