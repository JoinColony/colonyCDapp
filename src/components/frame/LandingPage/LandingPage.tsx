import { nanoid } from 'nanoid';
import React, { useEffect, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import InvitationBlock from '~common/InvitationBlock';
import { useAppContext } from '~context/AppContext';
import { usePageHeadingContext } from '~context/PageHeadingContext';
import CreateAColonyBanner from '~images/assets/landing/create-colony-banner.png';
import CreateAProfileBanner from '~images/assets/landing/create-profile-banner.png';
import {
  CREATE_COLONY_ROUTE_BASE,
  CREATE_PROFILE_ROUTE,
  METACOLONY_HOME_ROUTE,
  USER_EDIT_PROFILE_ROUTE,
  USER_HOME_ROUTE,
} from '~routes';
import Heading from '~shared/Heading';

import LandingPageItem from './LandingPageItem';

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

const LandingPage = () => {
  const [, setHoveredItem] = useState<number>(1);
  const navigate = useNavigate();
  const { user, connectWallet, wallet, userLoading } = useAppContext();
  const { setBreadcrumbs } = usePageHeadingContext();

  useEffect(() => {
    setBreadcrumbs([
      {
        key: 'landing-page',
        label: 'Colony App',
      },
    ]);
  }, [setBreadcrumbs]);

  const landingPageItems = [
    {
      buttonText: MSG.createColonyButtonText,
      headingText: MSG.createColonyTitle,
      headingDescription: MSG.createColonyDescription,
      iconName: 'layout',
      onClick: () => navigate(CREATE_COLONY_ROUTE_BASE),
      imgSrc: CreateAColonyBanner,
      disabled: true,
    },
    {
      buttonText: user
        ? MSG.viewUserProfileButtonText
        : MSG.createUserProfileButtonText,
      headingText: user ? MSG.viewUserProfileTitle : MSG.createUserProfileTitle,
      headingDescription: MSG.viewUserProfileDescription,
      iconName: 'user-circle',
      onClick: !wallet
        ? () => connectWallet()
        : () =>
            navigate(
              user
                ? `${USER_HOME_ROUTE}/${USER_EDIT_PROFILE_ROUTE}`
                : `${CREATE_PROFILE_ROUTE}`,
            ),
      imgSrc: CreateAProfileBanner,
      disabled: userLoading,
    },
    {
      buttonText: MSG.exploreMetacolonyButtonText,
      headingText: MSG.exploreMetacolonyTitle,
      headingDescription: MSG.exploreMetacolonyDescription,
      iconName: 'colony-icon',
      onClick: () => navigate(METACOLONY_HOME_ROUTE),
      disabled: true,
    },
  ];
  const hasShareableInvitationCode =
    !!user?.privateBetaInviteCode?.shareableInvites;

  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Heading
            text={{ id: 'colonyWelcome' }}
            className="font-semibold text-gray-900 text-3xl"
          />
          <span className="font-medium text-blue-400 text-sm px-3 py-1 bg-blue-100 rounded-3xl ml-3">
            <FormattedMessage {...MSG.privateBetaLabel} />
          </span>
        </div>
        <p className="text-md text-gray-600">
          <FormattedMessage {...MSG.headerDescription} />
        </p>
      </div>
      <div className="w-full flex justify-center gap-4">
        <div className="w-1/2 flex flex-col justify-between">
          {landingPageItems.map((item, index) => (
            <LandingPageItem
              key={nanoid()}
              {...item}
              itemIndex={index}
              onHover={setHoveredItem}
            />
          ))}
        </div>
        <img
          src={landingPageItems[1].imgSrc} // @TODO: Change to hoveredItem once we enable the create colony landing page item
          alt=""
          className="w-1/2 border border-gray-200 rounded-lg shadow-sm object-cover"
        />
      </div>
      {hasShareableInvitationCode && <InvitationBlock />}
    </div>
  );
};

LandingPage.displayName = displayName;

export default LandingPage;
