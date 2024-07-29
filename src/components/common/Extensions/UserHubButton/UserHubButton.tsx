import clsx from 'clsx';
import React, {
  type FC,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import { useSearchParams } from 'react-router-dom';

import UserHub from '~common/Extensions/UserHub/index.ts';
import MemberReputation from '~common/Extensions/UserNavigation/partials/MemberReputation/index.ts';
import { ADDRESS_ZERO } from '~constants';
import { useAnalyticsContext } from '~context/AnalyticsContext/AnalyticsContext.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { TransactionStatus } from '~gql';
import { useMobile } from '~hooks/index.ts';
import useDetectClickOutside from '~hooks/useDetectClickOutside.ts';
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

import { UserHubTabs } from '../UserHub/types.ts';
import { UserHubContext } from '../UserHubContext/UserHubContext.ts';

import { OPEN_USER_HUB_EVENT } from './consts.ts';

const displayName = 'common.Extensions.UserNavigation.partials.UserHubButton';

const UserHubButton: FC = () => {
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
  const [activeTab, setActiveTab] = useState(UserHubTabs.Balance);

  const { trackEvent } = useAnalyticsContext();
  const walletAddress = wallet?.address;

  const { setOpenItemIndex, mobileMenuToggle } = useNavigationSidebarContext();

  const [, { toggleOff }] = mobileMenuToggle;

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
              offset: isMobile ? [0, 1] : [0, 8],
            },
          },
        ],
      },
    );

  const openUserHub = useCallback(() => {
    if (!visible) {
      triggerRef?.click();
    }
  }, [triggerRef, visible]);

  const closeUserHub = useCallback(() => {
    if (visible) {
      triggerRef?.click();
    }
  }, [triggerRef, visible]);

  const ref = useDetectClickOutside({
    onTriggered: (e) => {
      // This stops the hub closing when clicking the pending button (which is outside)
      const targetEl = e.target as HTMLElement;
      const parentEl = targetEl.parentElement;
      if (
        [targetEl, parentEl].some((el) =>
          el?.getAttribute('data-openhubifclicked'),
        )
      ) {
        openUserHub();
        setActiveTab(UserHubTabs.Transactions);
      }
    },
  });

  useEffect(() => {
    if (transactionId !== previousTransactionId) {
      closeUserHub();
    }
  }, [transactionId, triggerRef, previousTransactionId, visible, closeUserHub]);

  useDisableBodyScroll(visible && isMobile);

  const handleButtonClick = () => {
    trackEvent(OPEN_USER_HUB_EVENT);
    setOpenItemIndex(undefined);
    toggleOff();
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
      openUserHub();
    }
    if (groupStatus !== prevGroupStatus) {
      setPrevGroupStatus(groupStatus);
    }
  }, [transactions, prevGroupStatus, openUserHub]);

  const value = useMemo(
    () => ({ activeTab, setActiveTab, closeUserHub }),
    [activeTab, closeUserHub],
  );

  const userName =
    user?.profile?.displayName ??
    splitWalletAddress(walletAddress ?? ADDRESS_ZERO);

  return (
    <div ref={ref} className="flex-shrink-0">
      <Button
        mode="tertiary"
        size="large"
        isFullRounded
        ref={setTriggerRef}
        className={clsx(
          {
            '!border-blue-400': visible,
          },
          'min-w-[3rem] md:hover:!border-blue-400',
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
      <UserHubContext.Provider value={value}>
        {visible && (
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
            <UserHub />
          </PopoverBase>
        )}
      </UserHubContext.Provider>
    </div>
  );
};

UserHubButton.displayName = displayName;

export default UserHubButton;
