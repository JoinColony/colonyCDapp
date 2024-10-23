import { Plus } from '@phosphor-icons/react';
import React from 'react';

import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/Button.tsx';

import BaseColonyCard from './BaseColonyCard/BaseColonyCard.tsx';

const displayName = 'frame.LandingPage.ColonyCards';

export interface ColonyCreateCardProps {
  invitationsRemaining: number;
  onCreate: () => void;
}
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
          {formatText(
            {
              id: 'landingPage.card.remaining',
            },
            { remaining: invitationsRemaining },
          ).toUpperCase()}
        </span>
      </div>
      <p className="text-md font-medium">
        {formatText({
          id: 'landingPage.card.createColony',
        })}
      </p>
    </div>
    <Button icon={Plus} onClick={onCreate}>
      {formatText({
        id: 'landingPage.card.createButton',
      })}
    </Button>
  </BaseColonyCard>
);

CreateNewColonyCard.displayName = displayName;

export default CreateNewColonyCard;
