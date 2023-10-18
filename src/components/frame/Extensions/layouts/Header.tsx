import React, { FC, useEffect } from 'react';

import { useSearchParams } from 'react-router-dom';
import { useMobile } from '~hooks';
import ColonySwitcher from '~common/Extensions/ColonySwitcher';
import UserNavigation from '~common/Extensions/UserNavigation';
import { CloseButton } from '~v5/shared/Button';
import ActionSidebar from '~v5/common/ActionSidebar';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import { ColonyAvatarProvider } from '~context/ColonyAvatarContext';
import HeaderAvatar from '~common/Extensions/UserNavigation/partials/HeaderAvatar';

import { HeaderProps } from './types';

const displayName = 'frame.Extensions.Header';

const Header: FC<HeaderProps> = ({
  // @TODO: We definitely want to avoid passing the colony object here for separation of concerns. PLEASE FIX THIS
  colony,
  navBar = null,
  txButtons,
  userHub,
}) => {
  const isMobile = useMobile();
  const {
    actionSidebarToggle: [
      isActionSidebarOpen,
      { toggleOn: toggleActionSidebarOn },
    ],
  } = useActionSidebarContext();
  const [searchParams] = useSearchParams();
  const transactionId = searchParams?.get('tx');

  useEffect(() => {
    if (transactionId) {
      toggleActionSidebarOn();
    }
  }, [toggleActionSidebarOn, transactionId]);

  const isCloseButtonVisible = isMobile && !isActionSidebarOpen && false;

  const isArrowVisible = !isMobile;

  const userHubComponent = userHub || <HeaderAvatar />;

  const userMenuComponent = isActionSidebarOpen ? (
    <ColonyAvatarProvider>
      <ActionSidebar transactionId={transactionId || undefined}>
        <UserNavigation txButtons={txButtons} userHub={userHubComponent} />
      </ActionSidebar>
    </ColonyAvatarProvider>
  ) : (
    <UserNavigation txButtons={txButtons} userHub={userHubComponent} />
  );

  return (
    <header className="relative">
      <div className="bg-base-white w-full flex min-h-[6.375rem] justify-center px-6">
        <div className="flex flex-col items-center justify-center gap-y-2 w-full">
          <div className="flex items-center justify-between sm:max-w-[90rem] w-full">
            <div className="mr-1.5 sm:mr-10">
              <ColonySwitcher
                activeColony={colony}
                isArrowVisible={isArrowVisible}
              />
            </div>
            <div className="flex w-full items-center gap-x-2 justify-between">
              <nav>{navBar}</nav>
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
          {txButtons}
        </div>
      </div>
    </header>
  );
};

Header.displayName = displayName;

export default Header;
