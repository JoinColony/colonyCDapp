import { SmileyMelting } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages } from 'react-intl';

import { formatText } from '~utils/intl.ts';

import { BaseTitleSection } from './BaseTitleSection.tsx';

const displayName =
  'v5.common.Navigation.ColonySwitcher.partials.NoColoniesJoinedSection';

const MSG = defineMessages({
  noColoniesJoinedSectionTitle: {
    id: `${displayName}.noColoniesJoinedSectionTitle`,
    defaultMessage: 'No colonies joined',
  },
  noColoniesJoinedSectionDescription: {
    id: `${displayName}.noColoniesJoinedSectionDescription`,
    defaultMessage: 'Once you join or create a colony, they will appear here.',
  },
});

export const NoColoniesJoinedSection = () => {
  return (
    <BaseTitleSection
      icon={SmileyMelting}
      title={formatText(MSG.noColoniesJoinedSectionTitle)}
      description={formatText(MSG.noColoniesJoinedSectionDescription)}
    />
  );
};
