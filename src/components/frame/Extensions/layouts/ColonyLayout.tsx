import clsx from 'clsx';
import { AnimatePresence } from 'framer-motion';
import React, {
  type FC,
  type PropsWithChildren,
  useCallback,
  useEffect,
  // useState,
} from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
//* Hide Initially */
// import { defineMessages } from 'react-intl';
// import { PaperPlaneTilt } from '@phosphor-icons/react';

import UserHubButton from '~common/Extensions/UserHubButton/index.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useColonyCreatedModalContext } from '~context/ColonyCreateModalContext/ColonyCreatedModalContext.ts';
import { useMemberModalContext } from '~context/MemberModalContext/MemberModalContext.ts';
import { usePageHeadingContext } from '~context/PageHeadingContext/PageHeadingContext.ts';
import { useTablet } from '~hooks';
import { TX_SEARCH_PARAM } from '~routes/index.ts';
import ActionSidebar from '~v5/common/ActionSidebar/index.ts';
import ColonyCreatedModal from '~v5/common/Modals/ColonyCreatedModal/index.ts';
import ManageMemberModal from '~v5/common/Modals/ManageMemberModal/index.ts';
//* Hide Initially */
// import { InviteMembersModal } from '~v5/common/Modals';
import ColonySidebar from '~v5/common/Navigation/ColonySidebar/ColonySidebar.tsx';
import PageLayout from '~v5/frame/PageLayout/index.ts';
//* Hide Initially */
// import Button from '~v5/shared/Button';
import JoinButton from '~v5/shared/Button/JoinButton/index.ts';
import CalamityBanner from '~v5/shared/CalamityBanner/index.ts';
import TxButton from '~v5/shared/TxButton/TxButton.tsx';

import { useCalamityBannerInfo } from './hooks.tsx';
import UserNavigationWrapper from './partials/UserNavigationWrapper/index.ts';

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
  const colonyContext = useColonyContext();
  const { colony } = colonyContext;
  const { title: pageHeadingTitle, breadcrumbs = [] } = usePageHeadingContext();
  // @TODO: Eventually we want the action sidebar context to be better intergrated in the layout (maybe only used here and not in UserNavigation(Wrapper))
  const { actionSidebarToggle, actionSidebarInitialValues } =
    useActionSidebarContext();
  const [isActionSidebarOpen, { toggleOn: toggleActionSidebarOn }] =
    actionSidebarToggle;
  const isTablet = useTablet();

  const {
    isMemberModalOpen,
    setIsMemberModalOpen,
    user: modalUser,
  } = useMemberModalContext();

  const { isColonyCreatedModalOpen, setIsColonyCreatedModalOpen } =
    useColonyCreatedModalContext();
  // const [isInviteMembersModalOpen, setIsInviteMembersModalOpen] =
  //   useState(false);

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

  const getUserNavigation = useCallback(
    (isHidden?: boolean) => (
      <UserNavigationWrapper
        txButton={<TxButton />}
        userHub={<UserHubButton />}
        className={clsx(
          'modal-blur-navigation [.show-header-in-modal_&]:z-userNavModal',
          {
            'relative z-userNav': !isTablet,
          },
        )}
        isHidden={isTablet && isHidden}
        extra={
          <>
            <JoinButton />
            {/* Hide Initially */}
            {/* {!isActionSidebarOpen ? (
                <Button
                  className="ml-1"
                  text={MSG.inviteMembers}
                  mode="quinary"
                  icon={PaperPlaneTilt}
                  size="small"
                  onClick={() => setIsInviteMembersModalOpen(true)}
                />
              ) : null} */}
          </>
        }
      />
    ),
    [isTablet],
  );

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
          colonyContext,
        }}
        sidebar={<ColonySidebar />}
      >
        {children}
      </PageLayout>
      <AnimatePresence>
        {isActionSidebarOpen && (
          <ActionSidebar
            transactionId={transactionId || undefined}
            initialValues={actionSidebarInitialValues}
            className="modal-blur"
          >
            {isTablet ? getUserNavigation() : undefined}
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
        isOpen={}
        onClose={() => setIsInviteMembersModalOpen(false)}
      /> */}
    </>
  );
};

ColonyLayout.displayName = displayName;

export default ColonyLayout;
