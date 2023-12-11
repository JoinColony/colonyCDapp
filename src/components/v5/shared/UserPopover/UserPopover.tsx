import React, { FC, PropsWithChildren, useCallback, useState } from 'react';
import { noop } from 'lodash';
import { usePopperTooltip } from 'react-popper-tooltip';
import clsx from 'clsx';

import { useMobile } from '~hooks';
import Modal from '~v5/shared/Modal';
import PopoverBase from '~v5/shared/PopoverBase';
import Icon from '~shared/Icon';

import UserInfo from './partials/UserInfo';
import { UserPopoverProps } from './types';

const displayName = 'v5.UserPopover';

const UserPopover: FC<PropsWithChildren<UserPopoverProps>> = ({
  userName,
  walletAddress,
  isVerified,
  user,
  userStatus,
  size,
  domains,
  isContributorsList,
  children,
  additionalContent,
  popperOptions,
  withVerifiedBadge = true,
  className,
  wrapperClassName,
}) => {
  const isMobile = useMobile();
  const [isOpen, setIsOpen] = useState(false);
  const { profile } = user || {};
  const { avatar, thumbnail } = profile || {};

  const onOpenModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({
      delayShow: 200,
      delayHide: 200,
      placement: popperOptions?.placement || 'bottom-end',
      trigger: ['click'],
      interactive: true,
    });

  const buttonComponent = (
    <button
      onClick={isMobile ? onOpenModal : noop}
      onMouseEnter={isMobile ? noop : () => onOpenModal()}
      onMouseLeave={isMobile ? noop : () => onCloseModal()}
      type="button"
      ref={setTriggerRef}
      className={clsx(
        className,
        'inline-flex transition-all duration-normal hover:text-blue-400 flex-shrink-0',
      )}
    >
      {children}
    </button>
  );

  const button = withVerifiedBadge ? (
    <div className={clsx(wrapperClassName, 'items-center flex flex-shrink-0')}>
      {buttonComponent}
      {isVerified && (
        <Icon
          name="verified"
          appearance={{ size: 'tiny' }}
          className="text-blue-400 ml-1"
        />
      )}
    </div>
  ) : (
    buttonComponent
  );

  const content = (
    <UserInfo
      user={user}
      size={size}
      userName={userName}
      title={userName}
      walletAddress={walletAddress}
      isVerified={isVerified}
      avatar={thumbnail || avatar || ''}
      userStatus={userStatus}
      domains={domains}
      isContributorsList={isContributorsList}
    />
  );

  const isTopSectionWithBackground = userStatus === 'top' && isContributorsList;
  return (
    <>
      {button}
      {isMobile ? (
        <Modal
          isFullOnMobile={false}
          onClose={onCloseModal}
          isOpen={isOpen}
          isTopSectionWithBackground={isTopSectionWithBackground}
        >
          {content}
          {additionalContent}
        </Modal>
      ) : (
        <>
          {visible && (
            <PopoverBase
              setTooltipRef={setTooltipRef}
              tooltipProps={getTooltipProps}
              classNames="max-w-[20rem]"
              withTooltipStyles={false}
              cardProps={{
                rounded: 's',
                className: clsx('bg-base-white', {
                  'p-6': !isTopSectionWithBackground,
                  'border-2 border-purple-200 overflow-hidden ':
                    userStatus === 'top',
                }),
                hasShadow: true,
              }}
              isTopSectionWithBackground={
                isTopSectionWithBackground && isMobile
              }
            >
              {content}
              {additionalContent}
            </PopoverBase>
          )}
        </>
      )}
    </>
  );
};

UserPopover.displayName = displayName;

export default UserPopover;
