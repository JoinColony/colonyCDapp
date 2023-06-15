import React, { FC, useCallback, useState } from 'react';
import { noop } from 'lodash';
import { usePopperTooltip } from 'react-popper-tooltip';

import { UserAvatarPopoverProps } from './types';
import UserAvatar from '~shared/Extensions/UserAvatar';
import { useMobile } from '~hooks';
import Modal from '../Modal';
import UserInfo from './partials/UserInfo';
import PopoverBase from '../PopoverBase';

const displayName = 'Extensions.UserAvatarPopover';

const UserAvatarPopover: FC<UserAvatarPopoverProps> = ({
  userName,
  walletAddress,
  isVerified,
  aboutDescription,
  colonyReputation,
  permissions,
  user,
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
      onMouseEnter={() => onOpenModal()}
      onMouseLeave={() => onCloseModal()}
      type="button"
      ref={setTriggerRef}
      className="inline-flex transition-all duration-normal hover:text-blue-400"
    >
      <UserAvatar size="xs" userName={userName} user={user} />
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
    />
  );

  return (
    <>
      {isMobile ? (
        <>
          {button}
          <Modal isFullOnMobile={false} onClose={onCloseModal} isOpen={isOpen}>
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
              classNames="max-w-[20rem]"
              withTooltipStyles={false}
              cardProps={{ rounded: 's' }}
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
