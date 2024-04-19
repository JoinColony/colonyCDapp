import clsx from 'clsx';
import React, { type FC, useState, useEffect } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

import UserHub from '~common/Extensions/UserHub/index.ts';
import MemberReputation from '~common/Extensions/UserNavigation/partials/MemberReputation/index.ts';
import { ADDRESS_ZERO } from '~constants';
import { useAnalyticsContext } from '~context/AnalyticsContext/AnalyticsContext.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useUserTransactionContext } from '~context/UserTransactionContext/UserTransactionContext.ts';
import { TransactionStatus } from '~gql';
import { useMobile } from '~hooks/index.ts';
import useDetectClickOutside from '~hooks/useDetectClickOutside.ts';
import useDisableBodyScroll from '~hooks/useDisableBodyScroll/index.ts';
import { splitWalletAddress } from '~utils/splitWalletAddress.ts';
import useNavigationSidebarContext from '~v5/frame/NavigationSidebar/partials/NavigationSidebarContext/hooks.ts';
import Button from '~v5/shared/Button/index.ts';
import PopoverBase from '~v5/shared/PopoverBase/index.ts';
import UserAvatar from '~v5/shared/UserAvatar/index.ts';

import { UserHubTabs } from '../UserHub/types.ts';

import { OPEN_USER_HUB_EVENT } from './consts.ts';
import { findNewestGroup, getGroupStatus } from './utils.ts';

const displayName = 'common.Extensions.UserNavigation.partials.UserHubButton';

const UserHubButton: FC = () => {
  const isMobile = useMobile();
  const {
    colony: { colonyAddress },
  } = useColonyContext();
  const { wallet, user } = useAppContext();
  const [isUserHubOpen, setIsUserHubOpen] = useState(false);
  const { transactionAndMessageGroups } = useUserTransactionContext();
  const [prevGroupStatus, setPrevGroupStatus] = useState<
    TransactionStatus | undefined
  >();

  const { trackEvent } = useAnalyticsContext();
  const walletAddress = wallet?.address;

  const { setOpenItemIndex, mobileMenuToggle } = useNavigationSidebarContext();

  const [, { toggleOff }] = mobileMenuToggle;

  const popperTooltipOffset = isMobile ? [0, 1] : [0, 8];

  const ref = useDetectClickOutside({
    onTriggered: (e) => {
      // This stops the hub closing when clicking the pending button (which is outside)
      if (!(e.target as HTMLElement)?.getAttribute('data-openhubifclicked')) {
        setIsUserHubOpen(false);
      } else {
        setIsUserHubOpen(true);
      }
    },
  });

  const { getTooltipProps, setTooltipRef, setTriggerRef, triggerRef, visible } =
    usePopperTooltip(
      {
        delayShow: isMobile ? 0 : 200,
        delayHide: isMobile ? 0 : 200,
        placement: isMobile ? 'bottom' : 'bottom-end',
        trigger: 'click',
        interactive: true,
        onVisibleChange: () => {},
        closeOnOutsideClick: true,
      },
      {
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: popperTooltipOffset,
            },
          },
        ],
      },
    );

  // If visible is not true, then clicking buttons within the popover will close it
  // So if isUserHubOpen is true, trigger a triggerRef click to ensure visible is true
  useEffect(() => {
    if (isUserHubOpen && !visible) {
      triggerRef?.click();
    }
  }, [isUserHubOpen, visible, triggerRef]);

  useDisableBodyScroll(visible && isMobile);

  const handleButtonClick = () => {
    trackEvent(OPEN_USER_HUB_EVENT);
    setOpenItemIndex(undefined);
    toggleOff();
  };

  const groupStatus = getGroupStatus(
    findNewestGroup(transactionAndMessageGroups),
  );

  useEffect(() => {
    if (
      groupStatus === TransactionStatus.Failed &&
      (prevGroupStatus === TransactionStatus.Pending ||
        prevGroupStatus === TransactionStatus.Ready)
    ) {
      setIsUserHubOpen(true);
    }
  }, [groupStatus, prevGroupStatus]);

  useEffect(() => {
    if (groupStatus && groupStatus !== prevGroupStatus) {
      setPrevGroupStatus(groupStatus);
    }
  }, [groupStatus, prevGroupStatus]);

  const userName =
    user?.profile?.displayName ??
    splitWalletAddress(walletAddress ?? ADDRESS_ZERO);

  return (
    <div ref={ref}>
      <Button
        mode="tertiary"
        size="large"
        isFullRounded
        ref={setTriggerRef}
        className={clsx(
          {
            '!border-blue-400': visible || isUserHubOpen,
          },
          'md:hover:!border-blue-400',
        )}
        onClick={handleButtonClick}
      >
        <div className="flex items-center">
          {/* If there's a user, there's a wallet */}
          {walletAddress ? (
            <>
              <UserAvatar
                userAvatarSrc={user?.profile?.avatar ?? undefined}
                userName={userName}
                userAddress={wallet.address}
                size={isMobile ? 18 : 16}
              />
              {!isMobile && (
                <>
                  <p className="ml-1 truncate text-sm font-medium">
                    {userName}
                  </p>
                  <div className="ml-2">
                    <MemberReputation
                      colonyAddress={colonyAddress}
                      hideOnMobile
                      walletAddress={walletAddress}
                    />
                  </div>
                </>
              )}
            </>
          ) : null}
        </div>
      </Button>
      {(visible || isUserHubOpen) && (
        <PopoverBase
          setTooltipRef={setTooltipRef}
          tooltipProps={getTooltipProps}
          classNames={clsx(
            'w-full border-none p-0 shadow-none sm:w-auto sm:rounded-lg sm:border sm:border-solid sm:border-gray-200 sm:shadow-default',
            {
              '!top-[calc(var(--top-content-height)-1.5rem)] h-[calc(100dvh-var(--top-content-height)+1.5rem)] !translate-x-0 !translate-y-0':
                isMobile,
            },
          )}
        >
          <UserHub
            defaultOpenedTab={
              isUserHubOpen ? UserHubTabs.Transactions : undefined
            }
          />
        </PopoverBase>
      )}
    </div>
  );
};

UserHubButton.displayName = displayName;

export default UserHubButton;
