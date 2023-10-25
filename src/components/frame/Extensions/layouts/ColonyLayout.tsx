import React, { FC, PropsWithChildren, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { defineMessages } from 'react-intl';

import UserHubButton from '~common/Extensions/UserHubButton';
import {
  useMemberModalContext,
  usePageHeadingContext,
  useUserTransactionContext,
  TransactionGroupStates,
} from '~context';
import {
  useMobile,
  useColonyContext,
  useColonySubscription,
  useAppContext,
} from '~hooks';
import { NOT_FOUND_ROUTE } from '~routes';
import ManageMemberModal from '~v5/common/Modals/ManageMemberModal';
import PageLayout from '~v5/frame/PageLayout';
import Button, { CompletedButton, PendingButton } from '~v5/shared/Button';
import CalamityBanner from '~v5/shared/CalamityBanner';
import { InviteMembersModal } from '~v5/common/Modals';

import UserNavigationWrapper from './partials/UserNavigationWrapper';
import { useCalamityBannerInfo } from './hooks';

import ColonySidebar from './ColonySidebar';

const displayName = 'frame.Extensions.layouts.ColonyLayout';

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

const ColonyLayout: FC<PropsWithChildren> = ({ children }) => {
  const { wallet, user, walletConnecting, userLoading } = useAppContext();
  const { colony, loading } = useColonyContext();
  const { canWatch, handleWatch } = useColonySubscription();
  const { title: pageHeadingTitle, breadcrumbs = [] } = usePageHeadingContext();
  const isMobile = useMobile();

  const {
    isMemberModalOpen,
    setIsMemberModalOpen,
    user: modalUser,
  } = useMemberModalContext();

  const [isInviteMembersModalOpen, setIsInviteMembersModalOpen] =
    useState(false);

  const { calamityBannerItems, canUpgrade } = useCalamityBannerInfo();

  const { groupState } = useUserTransactionContext();

  if (loading) {
    // We have a spinner outside of this
    return null;
  }

  if (!colony) {
    return <Navigate to={NOT_FOUND_ROUTE} />;
  }

  const txButtons = isMobile
    ? [
        groupState === TransactionGroupStates.SomePending && <PendingButton />,
        groupState === TransactionGroupStates.AllCompleted && (
          <CompletedButton />
        ),
      ]
    : null;

  const userHub = <UserHubButton hideUserNameOnMobile />;

  const noRegisteredUser = !user && !userLoading;
  const noWalletConnected = !wallet && !walletConnecting;
  const showJoinButton = canWatch || noWalletConnected || noRegisteredUser;

  return (
    <>
      <PageLayout
        topContent={
          canUpgrade ? (
            <CalamityBanner items={calamityBannerItems} />
          ) : undefined
        }
        headerProps={{
          pageHeadingProps: pageHeadingTitle
            ? {
                title: pageHeadingTitle,
                breadcrumbs: [
                  ...(colony?.name
                    ? [
                        {
                          key: '1',
                          href: `/colony/${colony?.name}`,
                          label: colony?.name,
                        },
                      ]
                    : []),
                  ...breadcrumbs,
                ],
              }
            : undefined,
          userNavigation: (
            <UserNavigationWrapper
              txButtons={txButtons}
              userHub={userHub}
              extra={
                <>
                  {showJoinButton && (
                    <Button
                      className="ml-4 mr-2"
                      mode="solidBlack"
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
          ),
        }}
        sidebar={<ColonySidebar userHub={userHub} txButtons={txButtons} />}
      >
        {children}
      </PageLayout>
      <ManageMemberModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        user={modalUser}
      />
    </>
  );
};

ColonyLayout.displayName = displayName;

export default ColonyLayout;
