import React from 'react';

import { formatText } from '~utils/intl.ts';
import SettingsRow from '~v5/common/SettingsRow/index.ts';

import MetatransactionsToggle from './partials/MetatransactionsToggle.tsx';

const displayName =
  'v5.pages.UserAdvancedPage.partials.MetaTransactionsSection';

const MetaTransactionsSection = () => {
  const toggleButton = <MetatransactionsToggle />;

  return (
    <SettingsRow.Container>
      <SettingsRow.Content rightContent={toggleButton}>
        <div className="flex items-center gap-1.5">
          <SettingsRow.Subtitle>
            {formatText({ id: 'advancedSettings.fees.title' })}
          </SettingsRow.Subtitle>
          <SettingsRow.Tooltip>
            {formatText({ id: 'advancedSettings.fees.tooltip' })}
          </SettingsRow.Tooltip>
        </div>
        <SettingsRow.Description>
          {formatText({ id: 'advancedSettings.fees.description' })}
        </SettingsRow.Description>
      </SettingsRow.Content>
    </SettingsRow.Container>
  );
};

MetaTransactionsSection.displayName = displayName;
export default MetaTransactionsSection;
