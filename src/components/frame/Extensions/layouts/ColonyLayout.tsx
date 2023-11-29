import React, { FC, PropsWithChildren, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { defineMessages } from 'react-intl';

import UserHubButton from '~common/Extensions/UserHubButton';
import {
  useMemberModalContext,
  usePageHeadingContext,
  useUserTransactionContext,
  TransactionGroupStates,
  useColonyCreatedModalContext,
} from '~context';
import { useMobile, useColonyContext } from '~hooks';
import { NOT_FOUND_ROUTE } from '~routes';
import ManageMemberModal from '~v5/common/Modals/ManageMemberModal';
import ColonyCreatedModal from '~v5/common/Modals/ColonyCreatedModal';
import PageLayout from '~v5/frame/PageLayout';
import Button, { CompletedButton, PendingButton } from '~v5/shared/Button';
import CalamityBanner from '~v5/shared/CalamityBanner';
import JoinButton from '~v5/shared/Button/JoinButton';

import ColonySidebar from './ColonySidebar';
import UserNavigationWrapper from './partials/UserNavigationWrapper';
import { useCalamityBannerInfo } from './hooks';

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
  const { colony, loading } = useColonyContext();
  const { title: pageHeadingTitle, breadcrumbs = [] } = usePageHeadingContext();
  const isMobile = useMobile();

  const {
    isMemberModalOpen,
    setIsMemberModalOpen,
    user: modalUser,
  } = useMemberModalContext();

  const { isColonyCreatedModalOpen, setIsColonyCreatedModalOpen } =
    useColonyCreatedModalContext();

  const { calamityBannerItems, canUpgrade } = useCalamityBannerInfo();

  const { groupState } = useUserTransactionContext();

  const { state: locationState } = useLocation();
  const hasRecentlyCreatedColony = locationState?.hasRecentlyCreatedColony;

  useEffect(() => {
    if (hasRecentlyCreatedColony) {
      setIsColonyCreatedModalOpen(true);
    }
  }, [hasRecentlyCreatedColony, setIsColonyCreatedModalOpen]);

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
                          href: `/${colony?.name}`,
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
                  <JoinButton />
                  <Button
                    text={MSG.inviteMembers}
                    mode="primaryOutline"
                    iconName="paper-plane-tilt"
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
      <ColonyCreatedModal
        isOpen={isColonyCreatedModalOpen}
        onClose={() => setIsColonyCreatedModalOpen(false)}
      />
    </>
  );
};

ColonyLayout.displayName = displayName;

export default ColonyLayout;
