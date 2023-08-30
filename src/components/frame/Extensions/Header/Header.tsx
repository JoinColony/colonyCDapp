import clsx from 'clsx';
import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import { useMobile } from '~hooks';
import ColonySwitcher from '~common/Extensions/ColonySwitcher';
import Icon from '~shared/Icon';
import UserNavigation from '~common/Extensions/UserNavigation';
import MainNavigation from '~common/Extensions/MainNavigation';
import { CloseButton, PendingButton } from '~v5/shared/Button';
import { useHeader } from './hooks';
import { HeaderProps } from './types';
import ActionSidebar from '~v5/common/ActionSidebar';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import { ActionFormContextProvider } from '~v5/common/ActionSidebar/partials/ActionForm/ActionFormContext';
import { ColnyAvatarProvider } from '~context/ColonyAvatarContext';
import { useUserTransactionContext } from '~context/UserTransactionContext';
import CompletedButton from '~v5/shared/Button/CompletedButton';

const displayName = 'frame.Extensions.Header';

const Header: FC<HeaderProps> = ({ hideColonies = false }) => {
  const isMobile = useMobile();
  const { formatMessage } = useIntl();
  const {
    mainMenuGetTooltipProps,
    mainMenuSetTooltipRef,
    mainMenuSetTriggerRef,
    colonySwitcherGetTooltipProps,
    colonySwitcherSetTooltipRef,
    colonySwitcherSetTriggerRef,
    userMenuGetTooltipProps,
    userMenuSetTooltipRef,
    userMenuSetTriggerRef,
    setWalletTriggerRef,
    isWalletButtonVisible,
    isMainMenuOpen,
    isColonySwitcherOpen,
    isUserMenuOpen,
    isWalletOpen,
  } = useHeader();
  const { isActionSidebarOpen } = useActionSidebarContext();

  const isCloseButtonVisible =
    (isMainMenuOpen || isColonySwitcherOpen) &&
    isMobile &&
    !isActionSidebarOpen;

  const isArrowVisible =
    !isMobile ||
    (isMobile &&
      (isColonySwitcherOpen ||
        isMainMenuOpen ||
        isUserMenuOpen ||
        isWalletOpen));

  const userNavigation = (
    <UserNavigation
      isWalletButtonVisible={isWalletButtonVisible}
      userMenuGetTooltipProps={userMenuGetTooltipProps}
      userMenuSetTooltipRef={userMenuSetTooltipRef}
      userMenuSetTriggerRef={userMenuSetTriggerRef}
      setWalletTriggerRef={setWalletTriggerRef}
      isUserMenuOpen={isUserMenuOpen}
      isWalletOpen={isWalletOpen}
      hideColonies={hideColonies}
    />
  );

  const userMenuComponent = isActionSidebarOpen ? (
    <ActionFormContextProvider>
      <ColnyAvatarProvider>
        <ActionSidebar>{userNavigation}</ActionSidebar>
      </ColnyAvatarProvider>
    </ActionFormContextProvider>
  ) : (
    userNavigation
  );

  const { isLatestTxPending, showCompletedButton } =
    useUserTransactionContext();

  return (
    <header className="relative">
      <div className="bg-base-white w-full flex min-h-[6.375rem] justify-center px-6">
        <div className="flex flex-col justify-center gap-y-2 w-full">
          <div className="flex items-center justify-between sm:max-w-[90rem] w-full">
            <div className="mr-1.5 sm:mr-10">
              <ColonySwitcher
                getTooltipProps={colonySwitcherGetTooltipProps}
                setTooltipRef={colonySwitcherSetTooltipRef}
                setTriggerRef={colonySwitcherSetTriggerRef}
                isColonyDropdownOpen={isColonySwitcherOpen}
                isArrowVisible={isArrowVisible}
              />
            </div>
            <div
              className={clsx('flex w-full items-center gap-x-2', {
                'justify-end': hideColonies,
                'justify-between': !hideColonies,
              })}
            >
              {!hideColonies && (
                <>
                  <button
                    type="button"
                    className={clsx('flex items-center sm:hidden', {
                      hidden:
                        isMainMenuOpen ||
                        isColonySwitcherOpen ||
                        isUserMenuOpen ||
                        isWalletOpen,
                    })}
                    ref={mainMenuSetTriggerRef}
                    aria-label={formatMessage({ id: 'ariaLabel.openMenu' })}
                  >
                    <Icon name="list" appearance={{ size: 'tiny' }} />
                    <span className="text-2 ml-1.5">
                      {formatMessage({ id: 'menu' })}
                    </span>
                  </button>
                  <MainNavigation
                    setTooltipRef={mainMenuSetTooltipRef}
                    tooltipProps={mainMenuGetTooltipProps}
                    isMenuOpen={isMainMenuOpen}
                  />
                </>
              )}
              <div>
                {isCloseButtonVisible ? (
                  <div className="relative z-[51] p-1.5 border border-transparent">
                    {/* This close button is a fallback that doesn't handle any action. The popover is closing when we click outside them 
                  and this is part of the header with a high z-index */}
                    <CloseButton iconSize="extraTiny" />
                  </div>
                ) : (
                  userMenuComponent
                )}
              </div>
            </div>
          </div>
          {isMobile && isLatestTxPending && <PendingButton />}
          {isMobile && showCompletedButton && <CompletedButton />}
        </div>
      </div>
    </header>
  );
};

Header.displayName = displayName;

export default Header;
