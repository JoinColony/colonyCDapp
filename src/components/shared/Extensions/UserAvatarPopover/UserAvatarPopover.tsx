import React, { FC, useCallback, useState } from 'react';
import { noop } from 'lodash';
import { UserAvatarPopoverProps } from './types';
import UserAvatar from '~shared/Extensions/UserAvatar';
import Card from '~shared/Extensions/Card';
import Popover from '~shared/Extensions/Popover';
import { useMobile } from '~hooks';
import Modal from '../Modal';
import UserInfo from './partials/UserInfo';

const displayName = 'Extensions.UserAvatarPopover';

const UserAvatarPopover: FC<UserAvatarPopoverProps> = ({
  popperOptions,
  userName,
  walletAddress,
  isVerified,
  copyUrl,
  aboutDescription,
  colonyReputation,
  permissions,
}) => {
  const isMobile = useMobile();
  const [isOpen, setIsOpen] = useState(false);

  const onOpenModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const button = (
    <button
      onClick={isMobile ? onOpenModal : noop}
      type="button"
      className="inline-flex transition-all duration-normal text-gray-900 hover:text-blue-400"
    >
      <UserAvatar size="xs" userName={userName} />
    </button>
  );

  const content = (
    <UserInfo
      userName={userName}
      title={userName}
      walletAddress={walletAddress}
      isVerified={isVerified}
      copyUrl={copyUrl}
      aboutDescription={aboutDescription}
      colonyReputation={colonyReputation}
      permissions={permissions}
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
        <Popover
          renderContent={<Card>{content}</Card>}
          popperOptions={popperOptions}
          trigger="click"
          placement="bottom"
        >
          {button}
        </Popover>
      )}
    </>
  );
};

UserAvatarPopover.displayName = displayName;

export default UserAvatarPopover;
