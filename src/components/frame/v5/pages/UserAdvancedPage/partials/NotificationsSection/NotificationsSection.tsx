import React from 'react';
import { defineMessages } from 'react-intl';

import { formatText } from '~utils/intl.ts';
import SettingsRow from '~v5/common/SettingsRow/index.ts';

import NotificationsToggle from './partials/NotificationsToggle.tsx';

const displayName = 'v5.pages.UserAdvancedPage.partials.NotificationsSection';

const MSG = defineMessages({
  sectionTitle: {
    id: `${displayName}.sectionTitle`,
    defaultMessage: 'Manage services',
  },
  sectionTooltip: {
    id: `${displayName}.sectionTooltip`,
    defaultMessage: 'no info yet',
  },
  sectionDescription: {
    id: `${displayName}.sectionDescription`,
    defaultMessage:
      'If you prefer maximum decentralization, you can disable and enable certain services Colony offers.',
  },
  notificationsTitle: {
    id: `${displayName}.notificationsTitle`,
    defaultMessage: 'Notifications',
  },
  notificationsDescription: {
    id: `${displayName}.notificationsDescription`,
    defaultMessage:
      'Enables in-app and external notifications for activity in colonies you’ve joined.',
  },
});

// @TODO if we get more items in this "section" split the sections up and rename this
const NotificationsSection = () => {
  const toggleButton = <NotificationsToggle />;

  return (
    <SettingsRow.Container>
      <SettingsRow.Content>
        <div className="flex items-center gap-1.5">
          <SettingsRow.Title>{formatText(MSG.sectionTitle)}</SettingsRow.Title>
          {/*
          <SettingsRow.Tooltip>
            {formatText(MSG.sectionTooltip)}
          </SettingsRow.Tooltip>
          */}
        </div>
        <SettingsRow.Description>
          {formatText(MSG.sectionDescription)}
        </SettingsRow.Description>
      </SettingsRow.Content>
      <SettingsRow.Content rightContent={toggleButton}>
        <SettingsRow.Subtitle>
          {formatText(MSG.notificationsTitle)}
        </SettingsRow.Subtitle>
        <SettingsRow.Description>
          {formatText(MSG.notificationsDescription)}
        </SettingsRow.Description>
      </SettingsRow.Content>
    </SettingsRow.Container>
  );
};

NotificationsSection.displayName = displayName;
export default NotificationsSection;
