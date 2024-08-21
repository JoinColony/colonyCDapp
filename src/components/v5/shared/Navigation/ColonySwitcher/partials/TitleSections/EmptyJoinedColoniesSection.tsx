import { SmileyMelting } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages } from 'react-intl';

import { formatText } from '~utils/intl.ts';

import { BaseTitleSection } from './BaseTitleSection.tsx';

const displayName =
  'v5.common.Navigation.ColonySwitcher.partials.EmptyJoinedColoniesSection';

const MSG = defineMessages({
  emptyJoinedColoniesSectionTitle: {
    id: `${displayName}.emptyJoinedColoniesSectionTitle`,
    defaultMessage: 'No colonies joined',
  },
  emptyJoinedColoniesSectionDescription: {
    id: `${displayName}.emptyJoinedColoniesSectionDescription`,
    defaultMessage: 'Once you join or create a colony, they will appear here.',
  },
});

export const EmptyJoinedColoniesSection = () => {
  return (
    <BaseTitleSection
      icon={SmileyMelting}
      title={formatText(MSG.emptyJoinedColoniesSectionTitle)}
      description={formatText(MSG.emptyJoinedColoniesSectionDescription)}
    />
  );
};
