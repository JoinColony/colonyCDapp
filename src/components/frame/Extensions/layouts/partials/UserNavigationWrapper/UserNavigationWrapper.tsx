import React, { FC, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { TX_SEARCH_PARAM } from '~routes';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import HeaderAvatar from '~common/Extensions/UserNavigation/partials/HeaderAvatar';
import UserNavigation from '~common/Extensions/UserNavigation';
import ActionSidebar from '~v5/common/ActionSidebar';

import { UserNavigationWrapperProps } from './types';

const displayName = 'frame.Extensions.partials.UserNavigationWrapper';

const UserNavigationWrapper: FC<UserNavigationWrapperProps> = ({
  userHub,
  txButtons,
  extra,
}) => {
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
  const userNavigation = (
    <UserNavigation
      txButtons={txButtons}
      userHub={userHubComponent}
      extra={extra}
    />
  );

  return (
    <div className="w-full flex">
      <div>
        <AnimatePresence>
          {isActionSidebarOpen && (
            <ActionSidebar
              transactionId={transactionId || undefined}
              initialValues={actionSidebarInitialValues}
            >
              {userNavigation}
            </ActionSidebar>
          )}
        </AnimatePresence>
        {!isActionSidebarOpen && userNavigation}
      </div>
      {txButtons}
    </div>
  );
};

UserNavigationWrapper.displayName = displayName;

export default UserNavigationWrapper;
