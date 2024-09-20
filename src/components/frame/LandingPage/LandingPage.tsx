import { Layout, UserCircle } from '@phosphor-icons/react';
import React, { useEffect, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import InvitationBlock from '~common/InvitationBlock/index.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useBreadcrumbsContext } from '~context/BreadcrumbsContext/BreadcrumbsContext.ts';
import { MainLayout } from '~frame/Extensions/layouts/index.ts';
import LoadingTemplate from '~frame/LoadingTemplate/index.ts';
import ColonyIcon from '~icons/ColonyIcon.tsx';
import CreateAColonyBanner from '~images/assets/landing/create-colony-banner.png';
import CreateAProfileBanner from '~images/assets/landing/create-profile-banner.png';
import {
  CREATE_COLONY_ROUTE_BASE,
  CREATE_PROFILE_ROUTE,
  METACOLONY_HOME_ROUTE,
  USER_EDIT_PROFILE_ROUTE,
  USER_HOME_ROUTE,
} from '~routes/index.ts';
import Heading from '~shared/Heading/index.ts';
import Button from '~v5/shared/Button/Button.tsx';
import { BasicPageSidebar } from '~v5/shared/Navigation/Sidebar/sidebars/BasicPageSidebar.tsx';

import LandingPageItem from './LandingPageItem.tsx';

const displayName = 'frame.LandingPage';

const MSG = defineMessages({
  privateBetaLabel: {
    id: `${displayName}.privateBetaLabel`,
    defaultMessage: 'Private Beta',
  },
  headerDescription: {
    id: `${displayName}.headerDescription`,
    defaultMessage:
      'The best way to build your online organization. Create a new colony, create a profile so you can contribute to other colonies or start with exploring the Metacolony.',
  },
  createColonyTitle: {
    id: `${displayName}.createColonyTitle`,
    defaultMessage: 'Create a Colony',
  },
  createColonyDescription: {
    id: `${displayName}.createColonyDescription`,
    defaultMessage:
      'Assemble your team, distribute authority, manage the money.',
  },
  createColonyButtonText: {
    id: `${displayName}.createColonyButtonText`,
    defaultMessage: 'Get Started',
  },
  createUserProfileTitle: {
    id: `${displayName}.createUserProfile`,
    defaultMessage: 'Create a profile',
  },
  createUserProfileButtonText: {
    id: `${displayName}.createUserProfileButtonText`,
    defaultMessage: 'Create',
  },
  viewUserProfileTitle: {
    id: `${displayName}.viewUserProfile`,
    defaultMessage: 'View profile',
  },
  viewUserProfileDescription: {
    id: `${displayName}.viewUserProfileDescription`,
    defaultMessage:
      'Define your identity, track your contributions, build your reputation.',
  },
  viewUserProfileButtonText: {
    id: `${displayName}.viewUserProfileButtonText`,
    defaultMessage: 'View',
  },
  exploreMetacolonyTitle: {
    id: `${displayName}.exploreMetacolony`,
    defaultMessage: 'Explore the Metacolony',
  },
  exploreMetacolonyDescription: {
    id: `${displayName}.exploreMetacolonyDescription`,
    defaultMessage: 'The Colony using Colony to build Colony.',
  },
  exploreMetacolonyButtonText: {
    id: `${displayName}.exploreMetacolonyButtonText`,
    defaultMessage: 'Explore',
  },
  inviteBlockTitle: {
    id: `${displayName}.inviteBlockTitle`,
    defaultMessage: 'Invite 1 person to create a Colony',
  },
  inviteBlockDescription: {
    id: `${displayName}.inviteBlockDescription`,
    defaultMessage:
      'You can invite only one member to create a colony of their own using the new app during the private beta with this custom invite link: app.colony.io/createcolony/{invitationCode}',
  },
});

const landingImagesSrc = [CreateAColonyBanner, CreateAProfileBanner];

const LandingPage = () => {
  const [, /* hoveredItemIndex */ setHoveredItemIndex] = useState<number>(1);
  const navigate = useNavigate();
  const { user, connectWallet, wallet, walletConnecting, userLoading } =
    useAppContext();
  const { setShouldShowBreadcrumbs } = useBreadcrumbsContext();

  useEffect(() => {
    setShouldShowBreadcrumbs(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (userLoading || walletConnecting) {
    return <LoadingTemplate />;
  }
  const hasShareableInvitationCode =
    !!user?.privateBetaInviteCode?.shareableInvites;

  return (
    <MainLayout sidebar={<BasicPageSidebar />}>
      <div className="w-full">
        <div className="mb-8">
          <div className="mb-4 flex items-center">
            <Heading
              text={{ id: 'colonyWelcome' }}
              className="text-3xl font-semibold text-gray-900"
            />
            <span className="ml-3 hidden rounded-3xl bg-blue-100 px-3 py-1 text-sm font-medium text-blue-400 sm:inline">
              <FormattedMessage {...MSG.privateBetaLabel} />
            </span>
          </div>
          <p className="text-md text-gray-600">
            <FormattedMessage {...MSG.headerDescription} />
          </p>
        </div>
        <div className="flex w-full justify-center gap-4">
          <div className="flex w-full flex-col justify-between gap-6 sm:w-1/2 sm:gap-4">
            <LandingPageItem
              headingText={MSG.createColonyTitle}
              headingDescription={MSG.createColonyDescription}
              icon={Layout}
              onMouseEnter={() => setHoveredItemIndex(0)}
              onMouseLeave={() => setHoveredItemIndex(0)}
              disabled
            >
              <Button
                text={MSG.createColonyButtonText}
                size="small"
                mode="quinary"
                isFullSize
                onClick={() => navigate(CREATE_COLONY_ROUTE_BASE)}
                disabled
              />
            </LandingPageItem>
            <LandingPageItem
              headingText={
                user ? MSG.viewUserProfileTitle : MSG.createUserProfileTitle
              }
              headingDescription={MSG.viewUserProfileDescription}
              icon={UserCircle}
              onMouseEnter={() => setHoveredItemIndex(1)}
              onMouseLeave={() => setHoveredItemIndex(0)}
            >
              <Button
                text={
                  user
                    ? MSG.viewUserProfileButtonText
                    : MSG.createUserProfileButtonText
                }
                size="small"
                mode="quinary"
                isFullSize
                onClick={
                  !wallet
                    ? () => connectWallet()
                    : () =>
                        navigate(
                          user
                            ? `${USER_HOME_ROUTE}/${USER_EDIT_PROFILE_ROUTE}`
                            : `${CREATE_PROFILE_ROUTE}`,
                        )
                }
              />
            </LandingPageItem>
            <LandingPageItem
              headingText={MSG.exploreMetacolonyTitle}
              headingDescription={MSG.exploreMetacolonyDescription}
              icon={ColonyIcon}
              onMouseEnter={() => setHoveredItemIndex(0)}
              onMouseLeave={() => setHoveredItemIndex(0)}
              disabled
            >
              <Button
                text={MSG.exploreMetacolonyButtonText}
                size="small"
                mode="quinary"
                isFullSize
                onClick={() => navigate(METACOLONY_HOME_ROUTE)}
                disabled
              />
            </LandingPageItem>
          </div>
          <img
            src={landingImagesSrc[1]} // @TODO: Change to hoveredItem once we enable the create colony landing page item
            alt=""
            className="hidden w-1/2 rounded-lg border border-gray-200 object-cover shadow-sm sm:block"
          />
        </div>
        {hasShareableInvitationCode && <InvitationBlock />}
      </div>
    </MainLayout>
  );
};

LandingPage.displayName = displayName;

export default LandingPage;
