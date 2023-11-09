import React, { FC, PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

import UserHubButton from '~common/Extensions/UserHubButton';
import {
  useMemberModalContext,
  usePageHeadingContext,
  useUserTransactionContext,
  TransactionGroupStates,
} from '~context';
import { useMobile, useColonyContext } from '~hooks';
import { NOT_FOUND_ROUTE } from '~routes';
import ManageMemberModal from '~v5/common/Modals/ManageMemberModal';
import PageLayout from '~v5/frame/PageLayout';
import { CompletedButton, PendingButton } from '~v5/shared/Button';
import CalamityBanner from '~v5/shared/CalamityBanner';

import UserNavigationWrapper from './partials/UserNavigationWrapper';
import { useCalamityBannerInfo } from './hooks';

import ColonySidebar from './ColonySidebar';

const displayName = 'frame.Extensions.layouts.ColonyLayout';

const ColonyLayout: FC<PropsWithChildren> = ({ children }) => {
  const { colony, loading } = useColonyContext();
  const { title: pageHeadingTitle, breadcrumbs = [] } = usePageHeadingContext();
  const isMobile = useMobile();

  const {
    isMemberModalOpen,
    setIsMemberModalOpen,
    user: modalUser,
  } = useMemberModalContext();

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
            <UserNavigationWrapper txButtons={txButtons} userHub={userHub} />
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
