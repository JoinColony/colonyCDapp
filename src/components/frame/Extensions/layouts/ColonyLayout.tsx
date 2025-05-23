// @TODO
// This component should not be in the Extensions directory
// Move this inside v5/shared/Navigation/PageLayout/layouts/ColonyPageLayout

import clsx from 'clsx';
import { AnimatePresence } from 'framer-motion';
//* Hide Initially */
// import { defineMessages } from 'react-intl';
// import { PaperPlaneTilt } from '@phosphor-icons/react';
import React, {
  type FC,
  type PropsWithChildren,
  useCallback,
  useEffect,
} from 'react';
import { useLocation } from 'react-router-dom';

import { UserHubTab } from '~common/Extensions/UserHub/types.ts';
import UserHubButton from '~common/Extensions/UserHubButton/index.ts';
import { useActionContext } from '~context/ActionContext/ActionContext.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyCreatedModalContext } from '~context/ColonyCreateModalContext/ColonyCreatedModalContext.ts';
import { useMemberModalContext } from '~context/MemberModalContext/MemberModalContext.ts';
import { usePageLayoutContext } from '~context/PageLayoutContext/PageLayoutContext.ts';
import { useTablet } from '~hooks';
import useLocationKeyChange from '~hooks/useLocationKeyChange.ts';
import useLocationPathnameChange from '~hooks/useLocationPathnameChange.ts';
import usePrevious from '~hooks/usePrevious.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import ActionSidebar from '~v5/common/ActionSidebar/index.ts';
import ColonyCreatedModal from '~v5/common/Modals/ColonyCreatedModal/index.ts';
import ManageMemberModal from '~v5/common/Modals/ManageMemberModal/index.ts';
//* Hide Initially */
// import { InviteMembersModal } from '~v5/common/Modals';
import PageLayout from '~v5/frame/PageLayout/index.ts';
//* Hide Initially */
// import Button from '~v5/shared/Button';
import JoinButton from '~v5/shared/Button/JoinButton/index.ts';
import CalamityBanner from '~v5/shared/CalamityBanner/index.ts';
import ColonyPageSidebar from '~v5/shared/Navigation/Sidebar/sidebars/ColonyPageSidebar/ColonyPageSidebar.tsx';
import TxButton from '~v5/shared/TxButton/TxButton.tsx';

import { useCalamityBannerInfo } from './hooks.ts';
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
  // @TODO: Eventually we want the action sidebar context to be better intergrated in the layout (maybe only used here and not in UserNavigation(Wrapper))
  const { actionSidebarToggle, actionSidebarInitialValues } =
    useActionSidebarContext();
  const [
    isActionSidebarOpen,
    { toggleOn: toggleActionSidebarOn, toggleOff: toggleActionSidebarOff },
  ] = actionSidebarToggle;
  const isTablet = useTablet();
  const { clearUserHubTab, setUserHubTab, userHubTab } = usePageLayoutContext();
  const actionType = actionSidebarInitialValues?.[ACTION_TYPE_FIELD_NAME];

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
  const { transactionHash } = useActionContext();
  const previousTransactionHash = usePrevious(transactionHash);

  const handleLocationPathnameChange = useCallback(() => {
    if (!!previousTransactionHash && !transactionHash && isActionSidebarOpen) {
      toggleActionSidebarOff();
    }
  }, [
    previousTransactionHash,
    transactionHash,
    isActionSidebarOpen,
    toggleActionSidebarOff,
  ]);

  const handleLocationHistoryChange = useCallback(() => {
    if (!transactionHash && !actionType && isActionSidebarOpen) {
      toggleActionSidebarOff();
    }
  }, [
    transactionHash,
    actionType,
    isActionSidebarOpen,
    toggleActionSidebarOff,
  ]);

  useLocationPathnameChange(handleLocationPathnameChange);

  useLocationKeyChange(handleLocationHistoryChange);

  useEffect(() => {
    if (transactionHash) {
      toggleActionSidebarOn();
    }
  }, [toggleActionSidebarOn, transactionHash]);

  useEffect(() => {
    if (hasRecentlyCreatedColony) {
      setIsColonyCreatedModalOpen(true);
    }
  }, [hasRecentlyCreatedColony, setIsColonyCreatedModalOpen]);

  // @TODO Please move this logic inside the UserNavigationWrapper component
  // Safely check if you're viewing a Colony page via useColonyContext({ nullableContext: true })
  // Then conditionally pass along the components i.e.
  // <UserNavigation
  //   txButton={colonyContext ? <TxButton /> : null}
  //   userHub={colonyContext ? <UserHubButton /> : <HeaderAvatar />}
  //   extra={<><WhateverExtraComponents /></>}
  // />
  // Please DO NOT forget to port over the following styles:
  // 'modal-blur-navigation [.show-header-in-modal_&]:z-userNavModal',
  // {
  // 'relative z-userNav': !isTablet,
  // },
  const getUserNavigation = useCallback(
    (isHidden?: boolean) => (
      <UserNavigationWrapper
        txButton={
          <TxButton onClick={() => setUserHubTab(UserHubTab.Transactions)} />
        }
        userHub={
          <UserHubButton openTab={userHubTab} onOpen={clearUserHubTab} />
        }
        className={clsx(
          'modal-blur-navigation [.show-header-in-modal_&]:z-userNavModal',
          {
            'relative z-userNav': !isTablet,
          },
        )}
        isHidden={isTablet && isHidden}
        /** @TODO: Rename arbitrary props. Let's try to be more explicit about what components need to be added */
        extra={
          <>
            <JoinButton />
            {/* @TODO: Create a new InviteMembersButton component that encapsulates relevant logic */}
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
    [clearUserHubTab, isTablet, setUserHubTab, userHubTab],
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
          /** @TODO: Move this inside the Header component */
          userNavigation: getUserNavigation(isActionSidebarOpen),
        }}
        sidebar={<ColonyPageSidebar />}
      >
        {children}
      </PageLayout>
      <AnimatePresence>
        {isActionSidebarOpen && (
          <ActionSidebar className="modal-blur">
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
      {/** @TODO: This should live within the button component responsible for triggering it */}
      {/* <InviteMembersModal
        isOpen={isInviteMembersModalOpen}
        onClose={() => setIsInviteMembersModalOpen(false)}
      /> */}
    </>
  );
};

ColonyLayout.displayName = displayName;

export default ColonyLayout;
