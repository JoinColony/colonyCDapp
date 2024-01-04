import { AnimatePresence } from 'framer-motion';
import React, {
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  // useState,
} from 'react';
import { Navigate, useLocation, useSearchParams } from 'react-router-dom';
//* Hide Initially */
// import { defineMessages } from 'react-intl';
// import { PaperPlaneTilt } from 'phosphor-react';

import UserHubButton from '~common/Extensions/UserHubButton';
import {
  useMemberModalContext,
  usePageHeadingContext,
  useColonyCreatedModalContext,
  useActionSidebarContext,
  useTokensModalContext,
} from '~context';
import { useAppContext, useColonyContext } from '~hooks';
import { NOT_FOUND_ROUTE, TX_SEARCH_PARAM } from '~routes';
import ActionSidebar from '~v5/common/ActionSidebar';
import ColonyCreatedModal from '~v5/common/Modals/ColonyCreatedModal';
import ManageMemberModal from '~v5/common/Modals/ManageMemberModal';
//* Hide Initially */
// import { InviteMembersModal } from '~v5/common/Modals';
import PageLayout from '~v5/frame/PageLayout';
//* Hide Initially */
// import Button from '~v5/shared/Button';
import JoinButton from '~v5/shared/Button/JoinButton';
import CalamityBanner from '~v5/shared/CalamityBanner';

import ColonySidebar from './ColonySidebar';
import { useCalamityBannerInfo, useGetTxButtons } from './hooks';
import UserNavigationWrapper from './partials/UserNavigationWrapper';

const displayName = 'frame.Extensions.layouts.ColonyLayout';

//* Hide Initially */
// const MSG = defineMessages({
//   inviteMembers: {
//     id: `${displayName}.inviteMembers`,
//     defaultMessage: 'Invite members',
//   },
// });

const ColonyLayout: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useAppContext();
  const { colony, loading } = useColonyContext();
  const { title: pageHeadingTitle, breadcrumbs = [] } = usePageHeadingContext();
  // @TODO: Eventually we want the action sidebar context to be better intergrated in the layout (maybe only used here and not in UserNavigation(Wrapper))
  const { actionSidebarToggle, actionSidebarInitialValues } =
    useActionSidebarContext();
  const [isActionSidebarOpen, { toggleOn: toggleActionSidebarOn }] =
    actionSidebarToggle;
  const txButtons = useGetTxButtons();

  const {
    isMemberModalOpen,
    setIsMemberModalOpen,
    user: modalUser,
  } = useMemberModalContext();

  const { isColonyCreatedModalOpen, setIsColonyCreatedModalOpen } =
    useColonyCreatedModalContext();
  // const [isInviteMembersModalOpen, setIsInviteMembersModalOpen] =
  //   useState(false);
  const { isTokensModalOpen } = useTokensModalContext();

  const { calamityBannerItems, canUpgrade } = useCalamityBannerInfo();

  const { state: locationState } = useLocation();
  const hasRecentlyCreatedColony = locationState?.hasRecentlyCreatedColony;
  const [searchParams] = useSearchParams();
  const transactionId = searchParams?.get(TX_SEARCH_PARAM);

  useEffect(() => {
    if (transactionId) {
      toggleActionSidebarOn();
    }
  }, [toggleActionSidebarOn, transactionId]);

  useEffect(() => {
    if (hasRecentlyCreatedColony) {
      setIsColonyCreatedModalOpen(true);
    }
  }, [hasRecentlyCreatedColony, setIsColonyCreatedModalOpen]);

  const userHub = useMemo(() => <UserHubButton hideUserNameOnMobile />, []);

  const getUserNavigation = useCallback(
    (isHidden?: boolean) =>
      !isTokensModalOpen ? (
        <UserNavigationWrapper
          txButtons={txButtons}
          userHub={userHub}
          isHidden={isHidden}
          extra={
            <>
              <JoinButton />
              {/* Hide Initially */}
              {/* {!isActionSidebarOpen ? (
                <Button
                  className="ml-1"
                  text={MSG.inviteMembers}
                  mode="quinary"
                  iconName={<PaperPlaneTilt />}
                  size="small"
                  onClick={() => setIsInviteMembersModalOpen(true)}
                />
              ) : null} */}
            </>
          }
        />
      ) : null,
    [isTokensModalOpen, txButtons, userHub],
  );

  if (loading) {
    // We have a spinner outside of this
    return null;
  }

  if (!colony) {
    return <Navigate to={NOT_FOUND_ROUTE} />;
  }

  return (
    <>
      <PageLayout
        topContent={
          canUpgrade ? (
            <CalamityBanner items={calamityBannerItems} />
          ) : undefined
        }
        headerProps={{
          pageHeadingProps: {
            title: pageHeadingTitle,
            breadcrumbs: [
              ...(colony.name
                ? [
                    {
                      key: '1',
                      href: `/${colony.name}`,
                      label: colony.metadata?.displayName || '',
                    },
                  ]
                : []),
              ...breadcrumbs,
            ],
          },
          userNavigation: getUserNavigation(isActionSidebarOpen),
        }}
        sidebar={<ColonySidebar userHub={userHub} txButtons={txButtons} />}
      >
        {children}
      </PageLayout>
      <AnimatePresence>
        {isActionSidebarOpen && (
          <ActionSidebar
            transactionId={transactionId || undefined}
            initialValues={actionSidebarInitialValues}
          >
            {getUserNavigation()}
          </ActionSidebar>
        )}
      </AnimatePresence>
      <ManageMemberModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        user={modalUser}
      />
      <ColonyCreatedModal
        isOpen={isColonyCreatedModalOpen}
        onClose={() => setIsColonyCreatedModalOpen(false)}
        shareableInvitesCount={
          user?.privateBetaInviteCode?.shareableInvites ?? 0
        }
      />
      {/* <InviteMembersModal
        isOpen={isInviteMembersModalOpen}
        onClose={() => setIsInviteMembersModalOpen(false)}
      /> */}
    </>
  );
};

ColonyLayout.displayName = displayName;

export default ColonyLayout;
