import { Plus } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Button from '~v5/shared/Button/Button.tsx';

import BaseColonyCard from './BaseColonyCard/BaseColonyCard.tsx';

const displayName = 'frame.LandingPage.partials.ColonyCards';

export interface ColonyCreateCardProps {
  invitationsRemaining: number;
  onCreate: () => void;
}

const MSG = defineMessages({
  remaining: {
    id: `${displayName}.remaining`,
    defaultMessage: `{remaining} {remaining, plural, one {COLONY} other {COLONIES}} REMANING`,
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
}: ColonyCreateCardProps) => {
  return (
    <BaseColonyCard
      onClick={() => onCreate()}
      isClickable
      avatarPlaceholder={
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
          <Plus size={18} className="text-gray-900 " />
        </div>
      }
    >
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex">
          <span className="rounded bg-blue-100 px-[.1875rem] py-[.1563rem] text-[.5rem] font-bold text-blue-400">
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
      <Button icon={Plus} className="border-gray-900" mode="primarySolid">
        <FormattedMessage {...MSG.createButton} />
      </Button>
    </BaseColonyCard>
  );
};

CreateNewColonyCard.displayName = displayName;

export default CreateNewColonyCard;
