import React from 'react';
import { defineMessages } from 'react-intl';

import ColonyInvitationBanner from '~frame/LandingPage/partials/ColonyInvitationBanner/ColonyInvitationBanner.tsx';
import { formatText } from '~utils/intl.ts';

const displayName = 'frame.LandingPage.partials.RightComponent';

interface RightComponentProps {
  remainingInvitations: number;
  inviteLink: string;
}

const MSG = defineMessages({
  createColonyTitle: {
    id: `${displayName}.createColonyTitle`,
    defaultMessage: 'Create a colony or share and invite others',
  },
  createColonyDescription: {
    id: `${displayName}.createColonyDescription`,
    defaultMessage:
      'As a part of the early access, creating a colony is limited to invites only. You can use the invites yourself or share with others.',
  },
  displayColoniesTitle: {
    id: `${displayName}.displayColoniesTitle`,
    defaultMessage: 'Explore your colonies',
  },
  displayColoniesDescription: {
    id: `${displayName}.displayColoniesDescription`,
    defaultMessage: 'View and navigate to your existing colonies.',
  },
});

const RightComponent = ({
  inviteLink,
  remainingInvitations,
}: RightComponentProps) => (
  <div className="w-full px-6 pt-8 md:min-h-[31.25rem] md:w-auto md:pt-0">
    <div className="hidden max-w-[31.25rem] md:block">
      <h1 className="pb-2 heading-2">{formatText(MSG.createColonyTitle)}</h1>
      <p className="pb-14 text-md font-normal text-gray-600">
        {formatText(MSG.createColonyDescription)}
      </p>
    </div>
    <div>
      <h1 className="pb-2 heading-2 md:hidden">
        {formatText(MSG.displayColoniesTitle)}
      </h1>
      <p className="pb-[1.625rem] text-md font-normal text-gray-600 md:hidden">
        {formatText(MSG.displayColoniesDescription)}
      </p>
    </div>
    <div className="w-full">
      <ColonyInvitationBanner
        coloniesRemaining={remainingInvitations}
        inviteLink={inviteLink}
      />
    </div>
  </div>
);

RightComponent.displayName = displayName;

export default RightComponent;
