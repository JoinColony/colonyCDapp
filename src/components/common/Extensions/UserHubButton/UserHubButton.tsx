import clsx from 'clsx';
import React, { type FC, useState, useEffect, useCallback } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import { useSearchParams } from 'react-router-dom';

import UserHub from '~common/Extensions/UserHub/index.ts';
import MemberReputation from '~common/Extensions/UserNavigation/partials/MemberReputation/index.ts';
import { ADDRESS_ZERO } from '~constants';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useAnalyticsContext } from '~context/AnalyticsContext/AnalyticsContext.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useNotificationsContext } from '~context/NotificationsContext/NotificationsContext.ts';
import { usePageLayoutContext } from '~context/PageLayoutContext/PageLayoutContext.ts';
import { useTokensModalContext } from '~context/TokensModalContext/TokensModalContext.ts';
import { TransactionStatus } from '~gql';
import { useMobile } from '~hooks/index.ts';
import useDisableBodyScroll from '~hooks/useDisableBodyScroll/index.ts';
import usePrevious from '~hooks/usePrevious.ts';
import { TX_SEARCH_PARAM } from '~routes';
import {
  getGroupStatus,
  useGroupedTransactions,
} from '~state/transactionState.ts';
import { splitWalletAddress } from '~utils/splitWalletAddress.ts';
import useNavigationSidebarContext from '~v5/frame/NavigationSidebar/partials/NavigationSidebarContext/hooks.ts';
import Button from '~v5/shared/Button/index.ts';
import PopoverBase from '~v5/shared/PopoverBase/index.ts';
import UserAvatar from '~v5/shared/UserAvatar/index.ts';

import { UserHubTab } from '../UserHub/types.ts';

import { OPEN_USER_HUB_EVENT } from './consts.ts';

interface Props {
  openTab?: UserHubTab;
  onOpen: () => void;
}

const displayName = 'common.Extensions.UserNavigation.partials.UserHubButton';

const UserHubButton: FC<Props> = ({ openTab, onOpen }) => {
  const isMobile = useMobile();
  const {
    colony: { colonyAddress },
  } = useColonyContext();
  const { wallet, user } = useAppContext();
  const { transactions } = useGroupedTransactions();
  const [prevGroupStatus, setPrevGroupStatus] = useState<
    TransactionStatus | undefined
  >();
  const [searchParams] = useSearchParams();
  const transactionId = searchParams?.get(TX_SEARCH_PARAM);
  const previousTransactionId = usePrevious(transactionId);
  const { actionSidebarToggle } = useActionSidebarContext();
  const [isActionSidebarOpen] = actionSidebarToggle;

  const { unreadCount } = useNotificationsContext();

  const { trackEvent } = useAnalyticsContext();
  const walletAddress = wallet?.address;

  const { setOpenItemIndex, mobileMenuToggle } = useNavigationSidebarContext();
  const { isTokensModalOpen } = useTokensModalContext();
  // Note that this will change once we have a better modal transaction experience
  const prevIsTokensModalOpen = usePrevious(isTokensModalOpen);

  const [, { toggleOff }] = mobileMenuToggle;

  const { setShowTabletColonyPicker, setShowTabletSidebar } =
    usePageLayoutContext();

  const popperTooltipOffset = isMobile ? [0, 1] : [0, 8];

  const [initialOpenTab, setInitialOpenTab] = useState<UserHubTab>();

  const { getTooltipProps, setTooltipRef, setTriggerRef, triggerRef, visible } =
    usePopperTooltip(
      {
        delayShow: isMobile ? 0 : 200,
        delayHide: isMobile ? 0 : 200,
        placement: isMobile ? 'bottom' : 'bottom-end',
        trigger: 'click',
        interactive: true,
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

  // This is how we should open the userhub now, from this file. It keeps the state in popper
  // Important! The user hub can't be closed from outside programmatically!
  const openUserHub = useCallback(
    (tab?: UserHubTab) => {
      if (!visible) {
        setInitialOpenTab(tab);
        triggerRef?.click();
      }
    },
    [triggerRef, visible],
  );

  const closeUserHub = useCallback(() => {
    if (visible) {
      triggerRef?.click();
    }
  }, [visible, triggerRef]);

  useEffect(() => {
    // openTab signals that we want to open the UserHub from outside with a specific tab
    // This immediately gets reset (onOpen) once the UserHub is open to prevent recursion
    if (openTab) {
      openUserHub(openTab);
      onOpen();
    }
    // once it's visible, we clear out the initial open tab again to open it with the default tab the next time
    if (!openTab && visible) {
      setInitialOpenTab(undefined);
    }
  }, [setInitialOpenTab, onOpen, openUserHub, openTab, triggerRef, visible]);

  useEffect(() => {
    if (transactionId !== previousTransactionId) {
      closeUserHub();
    }
  }, [transactionId, previousTransactionId, closeUserHub]);

  useEffect(() => {
    if (isTokensModalOpen && isTokensModalOpen !== prevIsTokensModalOpen) {
      closeUserHub();
    }
  }, [isTokensModalOpen, prevIsTokensModalOpen, closeUserHub]);

  useDisableBodyScroll(isMobile && visible);

  const handleButtonClick = () => {
    trackEvent(OPEN_USER_HUB_EVENT);
    setOpenItemIndex(undefined);
    toggleOff();
    setShowTabletColonyPicker(false);
    setShowTabletSidebar(false);
  };

  useEffect(() => {
    if (!transactions.length) {
      return;
    }
    const groupStatus = getGroupStatus(transactions[0]);
    if (
      groupStatus === TransactionStatus.Failed &&
      (prevGroupStatus === TransactionStatus.Pending ||
        prevGroupStatus === TransactionStatus.Ready)
    ) {
      openUserHub(UserHubTab.Transactions);
    }
    if (groupStatus !== prevGroupStatus) {
      setPrevGroupStatus(groupStatus);
    }
  }, [transactions, prevGroupStatus, openUserHub]);

  const userName =
    user?.profile?.displayName ??
    splitWalletAddress(walletAddress ?? ADDRESS_ZERO);

  const showNotificationDot = !!unreadCount && unreadCount > 0;

  return (
    <div className="flex-shrink-0">
      <Button
        mode="tertiary"
        size="large"
        isFullRounded
        ref={setTriggerRef}
        className={clsx(
          {
            '!border-blue-400': visible,
          },
          '!min-h-[2.375rem] min-w-[2.875rem] !px-3 !py-0 md:hover:!border-blue-400',
        )}
        onClick={handleButtonClick}
      >
        <div className="flex flex-shrink-0 items-center">
          {/* If there's a user, there's a wallet */}
          {walletAddress ? (
            <>
              <UserAvatar
                className="flex-shrink-0"
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
                  <div className="md:ml-2">
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
        {showNotificationDot && (
          <div className="absolute right-[-1.26px] top-[2.28px] h-2.5 w-2.5 rounded-full border border-base-white bg-blue-400" />
        )}
      </Button>
      {visible && (
        <PopoverBase
          setTooltipRef={setTooltipRef}
          tooltipProps={getTooltipProps}
          classNames={clsx(
            'w-full border-none bg-base-white p-0 shadow-none sm:w-auto sm:rounded-lg sm:border sm:border-solid sm:border-gray-200 sm:shadow-default',
            {
              '!top-[calc(var(--header-nav-section-height)-1.4rem)] h-[calc(100dvh-var(--top-content-height)+1.5rem)] !translate-x-0 !translate-y-0':
                isMobile && isActionSidebarOpen,
              '!top-[calc(var(--header-nav-section-height)+var(--top-content-height)-1.4rem)] h-[calc(100dvh-var(--top-content-height)+1.5rem)] !translate-x-0 !translate-y-0':
                isMobile && !isActionSidebarOpen,
            },
          )}
        >
          <UserHub initialOpenTab={initialOpenTab} />
        </PopoverBase>
      )}
    </div>
  );
};

UserHubButton.displayName = displayName;

export default UserHubButton;
