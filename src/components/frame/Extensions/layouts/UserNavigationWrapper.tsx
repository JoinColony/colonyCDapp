import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { useMobile } from '~hooks';
import { TX_SEARCH_PARAM } from '~routes';
import {
  TransactionGroupStates,
  useUserTransactionContext,
} from '~context/UserTransactionContext';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import UserHubButton from '~common/Extensions/UserHubButton';
import HeaderAvatar from '~common/Extensions/UserNavigation/partials/HeaderAvatar';
import UserNavigation from '~common/Extensions/UserNavigation';
import ActionSidebar from '~v5/common/ActionSidebar';
import { CompletedButton, PendingButton } from '~v5/shared/Button';

const displayName = 'frame.Extensions.UserNavigationWrapper';

const UserNavigationWrapper = () => {
  const isMobile = useMobile();
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
  const { groupState } = useUserTransactionContext();

  const txButtons = isMobile
    ? [
        groupState === TransactionGroupStates.SomePending && <PendingButton />,
        groupState === TransactionGroupStates.AllCompleted && (
          <CompletedButton />
        ),
      ]
    : null;

  const userHub = <UserHubButton hideUserNameOnMobile />;
  const userHubComponent = userHub || <HeaderAvatar />;
  const userNavigation = (
    <UserNavigation txButtons={txButtons} userHub={userHubComponent} />
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
