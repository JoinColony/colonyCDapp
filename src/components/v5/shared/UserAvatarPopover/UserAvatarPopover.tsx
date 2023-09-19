import React, { FC, PropsWithChildren, useState } from 'react';
import { noop } from 'lodash';
import { usePopperTooltip } from 'react-popper-tooltip';
import { isHexString } from 'ethers/lib/utils';

import { UserAvatarPopoverProps } from './types';
import UserAvatar from '~v5/shared/UserAvatar';
import { useMobile } from '~hooks';
import Modal from '~v5/shared/Modal';
import PopoverBase from '~v5/shared/PopoverBase';
import UserAvatarContent from './partials/UserAvatarContent';
import { splitWalletAddress } from '~utils/splitWalletAddress';

const displayName = 'v5.UserAvatarPopover';

const UserAvatarPopover: FC<PropsWithChildren<UserAvatarPopoverProps>> = ({
  userName,
  walletAddress,
  isVerified,
  aboutDescription,
  user,
  userStatus,
  avatarSize,
  domains,
  isContributorsList,
  children,
  isWarning,
}) => {
  const isMobile = useMobile();
  const [isOpen, setIsOpen] = useState(false);
  const userFormat =
    isHexString(userName) && userName ? splitWalletAddress(userName) : userName;

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
      onClick={isMobile ? () => setIsOpen(true) : noop}
      onMouseEnter={isMobile ? noop : () => setIsOpen(true)}
      onMouseLeave={isMobile ? noop : () => setIsOpen(false)}
      type="button"
      ref={setTriggerRef}
      className="inline-flex transition-all duration-normal hover:text-blue-400"
    >
      <UserAvatar
        size={avatarSize || 'xs'}
        userName={userFormat}
        user={user}
        userStatus={userStatus}
        isContributorsList={isContributorsList}
        isWarning={isWarning}
      />
    </button>
  );

  const content = (
    <UserAvatarContent
      userName={userFormat}
      title={userName}
      walletAddress={walletAddress}
      isVerified={isVerified}
      aboutDescription={aboutDescription}
      userStatus={userStatus}
      domains={domains}
      isContributorsList={isContributorsList}
    />
  );

  const isTopSectionWithBackground = userStatus === 'top' && isContributorsList;
  return (
    <>
      {isMobile ? (
        <>
          {button}
          <Modal
            isFullOnMobile={false}
            onClose={() => setIsOpen(false)}
            isOpen={isOpen}
            isTopSectionWithBackground={isTopSectionWithBackground}
          >
            {content}
            {children}
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
              cardProps={{
                rounded: 's',
                className: isTopSectionWithBackground ? 'pb-6' : '',
              }}
              isTopSectionWithBackground={isTopSectionWithBackground}
            >
              {content}
              {children}
            </PopoverBase>
          )}
        </>
      )}
    </>
  );
};

UserAvatarPopover.displayName = displayName;

export default UserAvatarPopover;
