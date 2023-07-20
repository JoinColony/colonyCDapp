import React, { FC, useCallback, useState } from 'react';
import { noop } from 'lodash';
import { usePopperTooltip } from 'react-popper-tooltip';

import { UserAvatarPopoverProps } from './types';
import UserAvatar from '~v5/shared/UserAvatar';
import { useMobile } from '~hooks';
import Modal from '~v5/shared/Modal';
import UserInfo from './partials/UserInfo';
import PopoverBase from '~v5/shared/PopoverBase';

const displayName = 'v5.UserAvatarPopover';

const UserAvatarPopover: FC<UserAvatarPopoverProps> = ({
  userName,
  walletAddress,
  isVerified,
  aboutDescription,
  colonyReputation,
  permissions,
  user,
  userStatus,
  avatarSize,
  teams,
  isContributorsList,
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
      placement: 'bottom-end',
      trigger: ['click', 'hover'],
      interactive: true,
    });

  const button = (
    <button
      onClick={isMobile ? onOpenModal : noop}
      onMouseEnter={isMobile ? noop : () => onOpenModal()}
      onMouseLeave={isMobile ? noop : () => onCloseModal()}
      type="button"
      ref={setTriggerRef}
      className="inline-flex transition-all duration-normal hover:text-blue-400"
    >
      <UserAvatar
        size={avatarSize || 'xs'}
        userName={userName}
        user={user}
        userStatus={userStatus}
        isContributorsList={isContributorsList}
      />
    </button>
  );

  const content = (
    <UserInfo
      userName={userName}
      title={userName}
      walletAddress={walletAddress}
      isVerified={isVerified}
      aboutDescription={aboutDescription}
      colonyReputation={colonyReputation}
      permissions={permissions}
      avatar={thumbnail || avatar || ''}
      userStatus={userStatus}
      teams={teams}
      isContributorsList={isContributorsList}
    />
  );

  return (
    <>
      {isMobile ? (
        <>
          {button}
          <Modal
            isFullOnMobile={false}
            onClose={onCloseModal}
            isOpen={isOpen}
            isTopSectionWithBackground={
              userStatus === 'top' && isContributorsList
            }
          >
            {content}
          </Modal>
        </>
      ) : (
        <>
          {button}
          {visible && (
            <PopoverBase
              setTooltipRef={setTooltipRef}
              tooltipProps={getTooltipProps}
              classNames="max-w-[20rem] shadow-default"
              withTooltipStyles={false}
              cardProps={{ rounded: 's' }}
              isTopSectionWithBackground={
                userStatus === 'top' && isContributorsList
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

UserAvatarPopover.displayName = displayName;

export default UserAvatarPopover;
