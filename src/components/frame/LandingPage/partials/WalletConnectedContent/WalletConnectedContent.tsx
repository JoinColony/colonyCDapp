import clsx from 'clsx';
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
  <div className="relative w-full">
    <div className="w-full md:absolute md:top-[50%] md:h-[31.25rem] md:translate-y-[-15.625rem] md:pt-0">
      <div className="flex h-full flex-col">
        <h1 className="hidden pb-2 heading-2 md:block">
          {formatText(MSG.displayColoniesTitle)}
        </h1>
        <p className="hidden text-md font-normal text-gray-600 md:block">
          {formatText(MSG.displayColoniesDescription)}
        </p>
        <p className="pb-3 pt-[1.625rem] text-xs font-medium text-gray-400">
          {formatText(MSG.coloniesCardsTitle)}
        </p>
        <div className="flex flex-col gap-3 pb-4 md:overflow-y-auto md:pb-0">
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
          <div
            className={clsx({
              'absolute bottom-0 w-full translate-y-[100%]':
                availableColonies.length > 4,
            })}
          >
            <ShareInvitationButton
              onCreateColony={onCreateColony}
              className="mt-[1.875rem]"
            />
          </div>
        )}
      </div>
    </div>
  </div>
);

WalletConnectedContent.displayName = displayName;

export default WalletConnectedContent;
