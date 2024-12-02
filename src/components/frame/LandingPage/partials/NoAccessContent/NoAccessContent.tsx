import { Keyhole } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages } from 'react-intl';

import { REQUEST_ACCESS } from '~constants';
import InfoBanner from '~frame/LandingPage/partials/InfoBanner/InfoBanner.tsx';
import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/Button.tsx';

const displayName = 'frame.LandingPage.partials.NoAccessContent';

const MSG = defineMessages({
  noAccessTitle: {
    id: `${displayName}.noAccessTitle`,
    defaultMessage: 'Welcome to Colony',
  },
  noAccessDescription: {
    id: `${displayName}.noAccessDescription`,
    defaultMessage:
      'Tools to manage shared funds easily, openly, and securely.',
  },
  noAccessInfo: {
    id: `${displayName}.noAccessInfo`,
    defaultMessage:
      'Colony is currently in limited early access. Request access to get on the list and be among the first to try out the new platform.',
  },
  noAccessButton: {
    id: `${displayName}.noAccessButton`,
    defaultMessage: 'Request access',
  },
});

const NoAccessContent = () => (
  <div className="flex w-full flex-col justify-between">
    <div>
      <h1 className="pb-2 heading-2">{formatText(MSG.noAccessTitle)}</h1>
      <p className="pb-9 text-md font-normal text-gray-600 md:pb-8">
        {formatText(MSG.noAccessDescription)}
      </p>
      <InfoBanner
        icon={Keyhole}
        title="Request early access"
        text={formatText(MSG.noAccessInfo)}
      />
    </div>
    <a href={REQUEST_ACCESS} target="_blank" rel="noreferrer">
      <Button isFullSize className="mt-8 hidden md:block">
        {formatText(MSG.noAccessButton)}
      </Button>
    </a>
  </div>
);

NoAccessContent.displayName = displayName;

export default NoAccessContent;
