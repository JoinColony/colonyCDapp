import React, { FC, PropsWithChildren } from 'react';
import { noop } from 'lodash';
import { usePopperTooltip } from 'react-popper-tooltip';

import { UserPopoverProps } from './types';
import { useMobile } from '~hooks';
import Modal from '~v5/shared/Modal';
import UserInfo from './partials/UserInfo';
import PopoverBase from '~v5/shared/PopoverBase';
import useToggle from '~hooks/useToggle';

const displayName = 'v5.UserPopover';

const UserPopover: FC<PropsWithChildren<UserPopoverProps>> = ({
  userName,
  walletAddress,
  isVerified,
  aboutDescription,
  user,
  userStatus,
  size,
  domains,
  isContributorsList,
  children,
  additionalContent,
}) => {
  const isMobile = useMobile();
  const { profile } = user || {};
  const { avatar, thumbnail } = profile || {};

  const [isVisible, { toggle: toggleSelect, toggleOff: toggleSelectOff }] =
    useToggle();

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
      onClick={isMobile ? toggleSelect : noop}
      onMouseEnter={isMobile ? noop : () => toggleSelect()}
      onMouseLeave={isMobile ? noop : () => toggleSelectOff()}
      type="button"
      ref={setTriggerRef}
      className="inline-flex transition-all duration-normal hover:text-blue-400"
    >
      {children}
    </button>
  );

  const content = (
    <UserInfo
      size={size}
      userName={userName}
      title={userName}
      walletAddress={walletAddress}
      isVerified={isVerified}
      aboutDescription={aboutDescription}
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
          onClose={toggleSelectOff}
          isOpen={isVisible}
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
              classNames="max-w-[20rem] shadow-default z-[60]"
              withTooltipStyles={false}
              cardProps={{
                rounded: 's',
                className: !isTopSectionWithBackground ? 'p-6' : '',
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
