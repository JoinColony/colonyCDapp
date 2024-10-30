import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { getFormattedTokenAmount } from '~v5/common/CompletedAction/partials/utils.ts';

import BaseColonyCard from './BaseColonyCard/BaseColonyCard.tsx';

export interface ColonyCardProps {
  colonyName: string;
  colonyAvatar: string;
  membersCount: number;
}

const displayName = 'frame.LandingPage.ColonyCards';

const MSG = defineMessages({
  members: {
    id: `${displayName}.members`,
    defaultMessage: `{members} {members, plural, one {Member} other {Members}}`,
  },
});

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
    <p className="flex-1 truncate text-ellipsis text-md font-medium">
      {colonyName}
    </p>
    <p className="max-w-[150px] justify-self-end text-xs font-normal text-gray-600">
      <FormattedMessage
        {...MSG.members}
        values={{
          members: getFormattedTokenAmount(`${membersCount}`, 0),
        }}
      />
    </p>
  </BaseColonyCard>
);

ColonyCard.displayName = displayName;

export default ColonyCard;
