import { Plus } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Button from '~v5/shared/Button/Button.tsx';

import BaseColonyCard from './BaseColonyCard/BaseColonyCard.tsx';

const displayName = 'frame.LandingPage.ColonyCards';

export interface ColonyCreateCardProps {
  invitationsRemaining: number;
  onCreate: () => void;
}

const MSG = defineMessages({
  remaining: {
    id: `${displayName}.remaining`,
    defaultMessage: `{remaining} INVITATIONS REMANING`,
  },
  createColony: {
    id: `${displayName}.createColony`,
    defaultMessage: `Create a new colony`,
  },
  createButton: {
    id: `${displayName}.createButton`,
    defaultMessage: `Create`,
  },
});

export const CreateNewColonyCard = ({
  invitationsRemaining,
  onCreate,
}: ColonyCreateCardProps) => (
  <BaseColonyCard
    isClickable
    avatarPlaceholder={
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
        <Plus size={18} className="text-gray-900 " />
      </div>
    }
  >
    <div className="flex flex-col gap-1">
      <div className="flex">
        <span className="rounded bg-blue-100 px-[.1875rem] py-[.1563rem] text-2xs font-extrabold text-blue-400">
          <FormattedMessage
            {...MSG.remaining}
            values={{ remaining: invitationsRemaining }}
          />
        </span>
      </div>
      <p className="text-md font-medium">
        <FormattedMessage {...MSG.createColony} />
      </p>
    </div>
    <Button icon={Plus} onClick={onCreate}>
      <FormattedMessage {...MSG.createButton} />
    </Button>
  </BaseColonyCard>
);

CreateNewColonyCard.displayName = displayName;

export default CreateNewColonyCard;
