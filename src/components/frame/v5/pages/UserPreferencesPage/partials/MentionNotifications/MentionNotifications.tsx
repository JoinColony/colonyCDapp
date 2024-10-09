import React from 'react';
import { defineMessages } from 'react-intl';

import { formatText } from '~utils/intl.ts';
import SettingsRow from '~v5/common/SettingsRow/index.ts';

import MentionNotificationsToggle from './MentionNotificationsToggle.tsx';

const displayName =
  'v5.pages.UserPreferencesPage.partials.MentionNotifications';

const MSG = defineMessages({
  mentionTitle: {
    id: `${displayName}.mentionTitle`,
    defaultMessage: 'Mention',
  },
  mentionDescription: {
    id: `${displayName}.mentionDescription`,
    defaultMessage:
      'Receive a notification when your username is mentioned across colonies',
  },
});

const MentionNotifications = () => {
  const toggleButton = <MentionNotificationsToggle />;

  return (
    <SettingsRow.Content rightContent={toggleButton}>
      <SettingsRow.Subtitle>
        {formatText(MSG.mentionTitle)}
      </SettingsRow.Subtitle>
      <SettingsRow.Description>
        {formatText(MSG.mentionDescription)}
      </SettingsRow.Description>
    </SettingsRow.Content>
  );
};

MentionNotifications.displayName = displayName;
export default MentionNotifications;
