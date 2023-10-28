import React, { useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import Heading from '~shared/Heading';
import CreateAColonyBanner from '~images/create-colony-banner.png';
import CreateAProfileBanner from '~images/create-profile-banner.png';

import LandingPageItem from './LandingPageItem';

const displayName = 'frame.LandingPage';

const MSG = defineMessages({
  headerTitle: {
    id: `${displayName}.callToAction`,
    defaultMessage: 'Welcome to Colony',
  },
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
  createUserProfileDescription: {
    id: `${displayName}.createUserProfileDescription`,
    defaultMessage:
      'Define your identity, track your contributions, build your reputation.',
  },
  createUserProfileButtonText: {
    id: `${displayName}.createUserProfileButtonText`,
    defaultMessage: 'Create',
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
});

const LandingPage = () => {
  const [hoveredItem, setHoveredItem] = useState<number>(0);
  const navigate = useNavigate();

  const landingPageItems = [
    {
      buttonText: MSG.createColonyButtonText,
      headingText: MSG.createColonyTitle,
      headingDescription: MSG.createColonyDescription,
      iconName: 'layout',
      // @TODO: Connect with real invitation code
      onClick: () => navigate('/create-colony/asd'),
      imgSrc: CreateAColonyBanner,
    },
    {
      buttonText: MSG.createUserProfileButtonText,
      headingText: MSG.createUserProfileTitle,
      headingDescription: MSG.createUserProfileDescription,
      iconName: 'user-circle',
      onClick: () => navigate('/create-user'),
      imgSrc: CreateAProfileBanner,
    },
    {
      buttonText: MSG.exploreMetacolonyButtonText,
      headingText: MSG.exploreMetacolonyTitle,
      headingDescription: MSG.exploreMetacolonyDescription,
      iconName: 'colony-icon',
      onClick: () => navigate('/colony/meta'),
      disabled: true,
    },
  ];

  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Heading
            text={MSG.headerTitle}
            className="font-semibold text-gray-900 text-3xl"
          />
          <span className="font-medium text-blue-400 text-sm px-3 py-1 bg-blue-100 rounded-3xl ml-3">
            <FormattedMessage {...MSG.privateBetaLabel} />
          </span>
        </div>
        <p className="text-normal text-gray-600">
          <FormattedMessage {...MSG.headerDescription} />
        </p>
      </div>
      <div className="w-full flex justify-center gap-4">
        <div className="w-1/2 flex flex-col gap-4">
          {landingPageItems.map((item, index) => (
            <LandingPageItem
              {...item}
              itemIndex={index}
              onHover={setHoveredItem}
            />
          ))}
        </div>
        <div className="w-1/2 bg-gray-100 rounded-lg max-h-[440px]">
          <img
            src={
              landingPageItems[hoveredItem].imgSrc ?? landingPageItems[0].imgSrc
            }
            className="w-full h-full"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

LandingPage.displayName = displayName;

export default LandingPage;
