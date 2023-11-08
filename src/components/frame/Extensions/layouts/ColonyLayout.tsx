import React, { FC, PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

import UserHubButton from '~common/Extensions/UserHubButton';
import { LEARN_MORE_PAYMENTS } from '~constants';
import {
  useActionSidebarContext,
  useMemberModalContext,
  usePageHeadingContext,
  useUserTransactionContext,
  TransactionGroupStates,
} from '~context';
import { useMobile, useColonyContext } from '~hooks';
import Logo from '~images/logo-new.svg';
import { CREATE_COLONY_ROUTE, NOT_FOUND_ROUTE } from '~routes';
import LearnMore from '~shared/Extensions/LearnMore';
import { formatText } from '~utils/intl';
import ManageMemberModal from '~v5/common/Modals/ManageMemberModal';
import PageLayout from '~v5/frame/PageLayout';
import Button, { CompletedButton, PendingButton } from '~v5/shared/Button';
import CalamityBanner from '~v5/shared/CalamityBanner';

import UserNavigationWrapper from './partials/UserNavigationWrapper';
import { useCalamityBannerInfo, useMainMenuItems } from './hooks';
import ColonySwitcherContent from './partials/ColonySwitcherContent';
import { getChainIconName } from './utils';

const displayName = 'frame.Extensions.layouts.ColonyLayout';

const ColonyLayout: FC<PropsWithChildren> = ({ children }) => {
  const mainMenuItems = useMainMenuItems();

  const {
    actionSidebarToggle: [, { toggle: toggleActionSideBar }],
  } = useActionSidebarContext();

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

  const { metadata, chainMetadata } = colony || {};
  const { chainId } = chainMetadata || {};

  const chainIcon = getChainIconName(chainId);

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
        navigationSidebarProps={{
          logo: <Logo />,
          additionalMobileContent: (
            <UserNavigationWrapper txButtons={txButtons} userHub={userHub} />
          ),
          mobileBottomContent: (
            <div className="w-full flex flex-col gap-6">
              <Button
                iconName="plus"
                className="w-full"
                onClick={() => toggleActionSideBar()}
              >
                {formatText({ id: 'button.createNewAction' })}
              </Button>
              <LearnMore
                message={{
                  id: `${displayName}.helpText`,
                  defaultMessage:
                    'Need help and guidance? <a>Visit our docs</a>',
                }}
                href={LEARN_MORE_PAYMENTS}
              />
            </div>
          ),
          hamburgerLabel: formatText({ id: 'menu' }),
          colonySwitcherProps: {
            avatarProps: {
              colonyImageProps: metadata?.avatar
                ? { src: metadata?.thumbnail || metadata?.avatar }
                : undefined,
              chainIconName: chainIcon,
            },
            content: {
              title:
                formatText({ id: 'navigation.colonySwitcher.title' }) || '',
              content: <ColonySwitcherContent colony={colony} />,
              bottomActionProps: {
                text: formatText({ id: 'button.createNewColony' }),
                iconName: 'plus',
                to: CREATE_COLONY_ROUTE,
              },
            },
          },
          mainMenuItems,
        }}
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
