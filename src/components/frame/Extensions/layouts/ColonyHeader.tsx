import React from 'react';
import { defineMessages } from 'react-intl';

import { useMobile } from '~hooks';
import ColonyNavigation from '~common/Extensions/ColonyNavigation';
import UserHubButton from '~common/Extensions/UserHubButton';
import Button, { CompletedButton, PendingButton } from '~v5/shared/Button';
import {
  TransactionGroupStates,
  useUserTransactionContext,
} from '~context/UserTransactionContext';

import Header from './Header';

const displayName = 'frame.Extensions.ColonyHeader';

const MSG = defineMessages({
  joinButtonText: {
    id: `${displayName}.joinButtonText`,
    defaultMessage: 'Join',
  },
  inviteMembers: {
    id: `${displayName}.inviteMembers`,
    defaultMessage: 'Invite members',
  },
});

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

  return (
    <Header
      navBar={navBar}
      userHub={userHub}
      txButtons={txButtons}
      extra={
        <>
          <Button
            className="ml-4 mr-2"
            mode="solidBlack"
            text={MSG.joinButtonText}
          />
          <Button
            text={MSG.inviteMembers}
            mode="primaryOutline"
            iconName="paper-plane-tilt"
          />
        </>
      }
    />
  );
};

ColonyHeader.displayName = displayName;

export default ColonyHeader;
