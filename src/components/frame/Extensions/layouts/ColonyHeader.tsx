import React, { useState } from 'react';
import { defineMessages } from 'react-intl';

import { useAppContext, useMobile } from '~hooks';
import ColonyNavigation from '~common/Extensions/ColonyNavigation';
import UserHubButton from '~common/Extensions/UserHubButton';
import Button, { CompletedButton, PendingButton } from '~v5/shared/Button';
import {
  TransactionGroupStates,
  useUserTransactionContext,
} from '~context/UserTransactionContext';
import { InviteMembersModal } from '~v5/common/Modals';

import Header from './Header';
import useColonySubscription from '~hooks/useColonySubscription';

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
  const { wallet, user, walletConnecting, userLoading } = useAppContext();
  const { groupState } = useUserTransactionContext();
  const { canWatch, handleWatch } = useColonySubscription();
  const [isInviteMembersModalOpen, setIsInviteMembersModalOpen] =
    useState(false);

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

  const noRegisteredUser = !user && !userLoading;
  const noWalletConnected = !wallet && !walletConnecting;
  const showJoinButton = canWatch || noWalletConnected || noRegisteredUser;

  return (
    <Header
      navBar={navBar}
      userHub={userHub}
      txButtons={txButtons}
      extra={
        <>
          {showJoinButton && (
            <Button
              className="ml-4 mr-2"
              mode="primaryOutline"
              text={MSG.joinButtonText}
              onClick={handleWatch}
            />
          )}
          <Button
            text={MSG.inviteMembers}
            mode="primaryOutline"
            iconName="paper-plane-tilt"
            onClick={() => setIsInviteMembersModalOpen(true)}
          />
          <InviteMembersModal
            isOpen={isInviteMembersModalOpen}
            onClose={() => setIsInviteMembersModalOpen(false)}
          />
        </>
      }
    />
  );
};

ColonyHeader.displayName = displayName;

export default ColonyHeader;
