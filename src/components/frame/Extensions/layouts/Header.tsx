import React, { FC, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import UserNavigation from '~common/Extensions/UserNavigation';
import ActionSidebar from '~v5/common/ActionSidebar';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import HeaderAvatar from '~common/Extensions/UserNavigation/partials/HeaderAvatar';

import { HeaderProps } from './types';
import { TX_SEARCH_PARAM } from '~routes';

const displayName = 'frame.Extensions.Header';

const Header: FC<HeaderProps> = ({ navBar = null, txButtons, userHub }) => {
  const {
    actionSidebarToggle: [
      isActionSidebarOpen,
      { toggleOn: toggleActionSidebarOn },
    ],
    actionSidebarInitialValues,
  } = useActionSidebarContext();
  const [searchParams] = useSearchParams();
  const transactionId = searchParams?.get(TX_SEARCH_PARAM);

  useEffect(() => {
    if (transactionId) {
      toggleActionSidebarOn();
    }
  }, [toggleActionSidebarOn, transactionId]);

  const userHubComponent = userHub || <HeaderAvatar />;

  return (
    <header className="relative">
      <div className="bg-base-white w-full flex px-6">
        <div className="flex items-center justify-between sm:max-w-[90rem] w-full">
          <div className="mr-1.5 sm:mr-10" />
          <div className="flex w-full items-center gap-x-2 justify-between py-4">
            <nav>{navBar}</nav>
            <div>
              <AnimatePresence>
                {isActionSidebarOpen && (
                  <ActionSidebar
                    transactionId={transactionId || undefined}
                    initialValues={actionSidebarInitialValues}
                  >
                    <UserNavigation
                      txButtons={txButtons}
                      userHub={userHubComponent}
                    />
                  </ActionSidebar>
                )}
              </AnimatePresence>
              {!isActionSidebarOpen && (
                <UserNavigation
                  txButtons={txButtons}
                  userHub={userHubComponent}
                />
              )}
            </div>
          </div>
        </div>
        {txButtons}
      </div>
    </header>
  );
};

Header.displayName = displayName;

export default Header;
