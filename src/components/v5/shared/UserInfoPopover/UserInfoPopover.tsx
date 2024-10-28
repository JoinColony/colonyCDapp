import clsx from 'clsx';
import { noop } from 'lodash';
import React, { type FC, useCallback, useState } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

import { ContributorType } from '~gql';
import { useMobile } from '~hooks/index.ts';
import Modal from '~v5/shared/Modal/index.ts';
import PopoverBase from '~v5/shared/PopoverBase/index.ts';

import UserDetails from '../UserDetails/UserDetails.tsx';

import { useGetUserData } from './hooks.ts';
import UserInfo from './partials/UserInfo.tsx';
import UserInfoPopoverTrigger from './partials/UserInfoPopoverTrigger.tsx';
import UserNotVerified from './partials/UserNotVerified.tsx';
import { type UserInfoPopoverProps } from './types.ts';

const displayName = 'v5.UserInfoPopover';

const UserInfoPopover: FC<UserInfoPopoverProps> = ({
  className,
  walletAddress,
  user,
  children,
  popperOptions,
  withVerifiedBadge = true,
}) => {
  const isMobile = useMobile();
  const [isOpen, setIsOpen] = useState(false);

  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const {
    bio,
    domains,
    userName,
    avatar,
    isVerified,
    contributorType,
    isDataLoading,
    resolvedUser,
  } = useGetUserData(walletAddress, user);

  const { getTooltipProps, setTooltipRef, setTriggerRef } = usePopperTooltip(
    {
      delayShow: 200,
      delayHide: 200,
      placement: popperOptions?.placement || 'bottom-end',
      trigger: ['click'],
      interactive: true,
      visible: isTooltipVisible,
      onVisibleChange: setIsTooltipVisible,
    },
    popperOptions,
  );

  const onOpenModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const openUserPopover = useCallback(() => {
    setIsTooltipVisible(true);
  }, []);
  const closeUserPopover = useCallback(() => {
    setIsTooltipVisible(false);
  }, []);

  const onClickHandler = isMobile ? onOpenModal : openUserPopover;
  const onMouseEnterHandler = isMobile ? noop : onOpenModal;
  const onMouseLeaveHandler = isMobile ? noop : onCloseModal;

  const content = (
    <UserInfo
      aboutDescription={bio || ''}
      contributorType={contributorType ?? undefined}
      domains={domains}
      userDetails={
        <UserDetails
          isVerified={isVerified}
          userName={userName}
          userAvatarSrc={avatar ?? undefined}
          walletAddress={walletAddress}
          contributorType={contributorType ?? undefined}
        />
      }
      additionalContent={
        !isVerified ? (
          <UserNotVerified
            onClick={closeUserPopover}
            walletAddress={walletAddress}
            description={
              <div className="mt-2 break-words pb-2 text-sm font-semibold">
                {walletAddress}
              </div>
            }
          />
        ) : null
      }
    />
  );

  const isTopSectionWithBackground = contributorType === ContributorType.Top;

  return (
    <>
      <UserInfoPopoverTrigger
        onClick={onClickHandler}
        onMouseEnter={onMouseEnterHandler}
        onMouseLeave={onMouseLeaveHandler}
        ref={setTriggerRef}
        className={className}
        isLoading={isDataLoading}
        showVerifiedBadge={withVerifiedBadge && isVerified}
      >
        {typeof children === 'function'
          ? children(resolvedUser ?? undefined)
          : children}
      </UserInfoPopoverTrigger>
      {isMobile ? (
        <Modal
          isFullOnMobile={false}
          onClose={onCloseModal}
          isOpen={isOpen}
          withPadding={false}
          withPaddingBottom
          withBorder={isTopSectionWithBackground}
        >
          {content}
        </Modal>
      ) : (
        <>
          {isTooltipVisible && (
            <PopoverBase
              setTooltipRef={setTooltipRef}
              tooltipProps={getTooltipProps}
              classNames="sm:w-[21.875rem]"
              withTooltipStyles={false}
              cardProps={{
                rounded: 's',
                className: clsx('bg-base-white', {
                  'overflow-hidden border-2 border-purple-200 ':
                    isTopSectionWithBackground,
                }),
                hasShadow: true,
              }}
              isTopSectionWithBackground={
                isTopSectionWithBackground && isMobile
              }
            >
              {content}
            </PopoverBase>
          )}
        </>
      )}
    </>
  );
};

UserInfoPopover.displayName = displayName;

export default UserInfoPopover;
