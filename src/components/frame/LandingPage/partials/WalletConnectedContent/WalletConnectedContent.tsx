import React from 'react';
import { defineMessages } from 'react-intl';
import { Link } from 'react-router-dom';

import { type AvailableColonies } from '~frame/LandingPage/hooks.ts';
import ColonyCard from '~frame/LandingPage/partials/ColonyCards/ColonyCard.tsx';
import CreateNewColonyCard from '~frame/LandingPage/partials/ColonyCards/CreateNewColonyCard.tsx';
import { formatText } from '~utils/intl.ts';

import ShareInvitationButton from '../ShareInvitationButton/ShareInvitationButton.tsx';

const displayName = 'frame.LandingPage.partials.WalletConnectedContent';

const MSG = defineMessages({
  displayColoniesTitle: {
    id: `${displayName}.displayColoniesTitle`,
    defaultMessage: 'Explore your colonies',
  },
  displayColoniesDescription: {
    id: `${displayName}.displayColoniesDescription`,
    defaultMessage: 'View and navigate to your existing colonies.',
  },
  coloniesCardsTitle: {
    id: `${displayName}.coloniesCardsTitle`,
    defaultMessage: 'YOUR COLONIES',
  },
});

interface WalletConnectedContentProps {
  availableColonies: AvailableColonies;
  onCreateColony: () => void;
  hasShareableInvitationCode: boolean;
  remainingInvitations: number;
}

const WalletConnectedContent = ({
  availableColonies,
  onCreateColony,
  hasShareableInvitationCode,
  remainingInvitations,
}: WalletConnectedContentProps) => (
  <div className="h-full w-full md:max-h-[calc(100%-126px)] md:pt-0">
    <div className="flex h-full flex-col justify-end ">
      <h1 className="hidden pb-2 heading-2 md:block">
        {formatText(MSG.displayColoniesTitle)}
      </h1>
      <p className="hidden text-md font-normal text-gray-600 md:block">
        {formatText(MSG.displayColoniesDescription)}
      </p>
      <p className="pb-3 pt-[1.625rem] text-xs font-medium text-gray-400">
        {formatText(MSG.coloniesCardsTitle)}
      </p>
      <div className="flex h-full flex-col gap-3 md:max-w-[440px] md:overflow-y-auto">
        {availableColonies.length ? (
          availableColonies.map(
            ({
              address,
              avatar,
              membersCount,
              name,
              displayName: colonyName,
            }) => (
              <Link to={`/${name}`} key={address}>
                <ColonyCard
                  colonyAddress={address}
                  colonyAvatar={avatar}
                  colonyName={colonyName ?? ''}
                  membersCount={membersCount ?? 0}
                />
              </Link>
            ),
          )
        ) : (
          <CreateNewColonyCard
            invitationsRemaining={remainingInvitations}
            onCreate={onCreateColony}
          />
        )}
      </div>
      {hasShareableInvitationCode && (
        <ShareInvitationButton onCreateColony={onCreateColony} />
      )}
    </div>
  </div>
);

WalletConnectedContent.displayName = displayName;

export default WalletConnectedContent;
