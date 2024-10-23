import React from 'react';

import { formatText } from '~utils/intl.ts';

import BaseColonyCard from './BaseColonyCard/BaseColonyCard.tsx';

export interface ColonyCardProps {
  colonyName: string;
  colonyAvatar: string;
  membersCount: number;
}

const displayName = 'frame.LandingPage.ColonyCards';

export const ColonyCard = ({
  colonyName,
  colonyAvatar,
  membersCount = 0,
}: ColonyCardProps) => (
  <BaseColonyCard
    isClickable
    avatarPlaceholder={
      <img
        src={colonyAvatar}
        alt="Colony avatar"
        className="w-8 rounded-full"
      />
    }
  >
    <p className="text-md font-medium">{colonyName}</p>
    <p className="text-xs font-normal">
      {formatText(
        {
          id: 'landingPage.card.members',
        },
        { members: membersCount.toLocaleString('en-US') },
      )}
    </p>
  </BaseColonyCard>
);

ColonyCard.displayName = displayName;

export default ColonyCard;
