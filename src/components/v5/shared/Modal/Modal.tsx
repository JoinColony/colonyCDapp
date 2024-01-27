import clsx from 'clsx';
import React, { FC, PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';

import UserHubButton from '~common/Extensions/UserHubButton/index.ts';
import { useGetTxButtons } from '~frame/Extensions/layouts/hooks.tsx';
import { UserNavigationWrapper } from '~frame/Extensions/layouts/index.ts';
import { useMobile } from '~hooks/index.ts';
import Icon from '~shared/Icon/index.ts';
import Button, { CloseButton } from '~v5/shared/Button/index.ts';

import JoinButton from '../Button/JoinButton/index.ts';

import ModalBase from './ModalBase.tsx';
import { ModalProps } from './types.ts';

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
  shouldShowHeader = false,
  ...props
}) => {
  const { formatMessage } = useIntl();
  const txButtons = useGetTxButtons();
  const isMobile = useMobile();

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
              'border-negative-200 text-negative-400': isWarning,
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
      {!isMobile && shouldShowHeader && (
        <div className="fixed top-9 right-4 z-10">
          <div className="relative">
            <UserNavigationWrapper
              txButtons={txButtons}
              userHub={<UserHubButton />}
              extra={<JoinButton />}
            />
          </div>
        </div>
      )}
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
