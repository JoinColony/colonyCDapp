import React from 'react';

import { useMobile } from '~hooks';
import ColonyNavigation from '~common/Extensions/ColonyNavigation';
import UserHubButton from '~common/Extensions/UserHubButton';
import { CompletedButton, PendingButton } from '~v5/shared/Button';
import {
  TransactionGroupStates,
  useUserTransactionContext,
} from '~context/UserTransactionContext';

import Header from './Header';

const displayName = 'frame.Extensions.ColonyHeader';

const ColonyHeader = () => {
  const isMobile = useMobile();
  const { groupState } = useUserTransactionContext();

  const txButtons = isMobile
    ? [
        groupState === TransactionGroupStates.SomePending && <PendingButton />,
        groupState === TransactionGroupStates.AllCompleted && (
          <CompletedButton />
        ),
      ]
    : null;

  const navBar = <ColonyNavigation />;

  const userHub = <UserHubButton />;

  return <Header navBar={navBar} userHub={userHub} txButtons={txButtons} />;
};

ColonyHeader.displayName = displayName;

export default ColonyHeader;
