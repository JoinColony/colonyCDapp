import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { getFormattedNumeralValue } from '~shared/Numeral/helpers.tsx';
import { convertToDecimal } from '~utils/convertToDecimal.ts';
import ColonyAvatar from '~v5/shared/ColonyAvatar/ColonyAvatar.tsx';

import BaseColonyCard from './BaseColonyCard/BaseColonyCard.tsx';

export interface ColonyCardProps {
  colonyAddress: string;
  colonyName: string;
  colonyAvatar?: string;
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
  colonyAddress,
  colonyName,
  colonyAvatar,
  membersCount = 0,
}: ColonyCardProps) => {
  const membersDecimalValue = convertToDecimal(membersCount, 0);

  return (
    <BaseColonyCard
      isClickable
      avatarPlaceholder={
        <ColonyAvatar
          colonyAddress={colonyAddress}
          size={32}
          colonyImageSrc={colonyAvatar}
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
            members: getFormattedNumeralValue(membersDecimalValue, 0),
          }}
        />
      </p>
    </BaseColonyCard>
  );
};

ColonyCard.displayName = displayName;

export default ColonyCard;
