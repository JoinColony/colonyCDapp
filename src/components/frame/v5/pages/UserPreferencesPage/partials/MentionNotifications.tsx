import React from 'react';
import { defineMessages } from 'react-intl';

import { formatText } from '~utils/intl.ts';
import NotificationTypeToggle from '~v5/common/NotificationTypeToggle/NotificationTypeToggle.tsx';
import SettingsRow from '~v5/common/SettingsRow/index.ts';

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
  toastMentionNotificationsEnabled: {
    id: `${displayName}.toastMentionNotificationsEnabled`,
    defaultMessage:
      'You will now receive notifications when your username is mentioned.',
  },
  toastMentionNotificationsDisabled: {
    id: `${displayName}.toastMentionNotificationsDisabled`,
    defaultMessage:
      'You will no longer receive notifications when your username is mentioned.',
  },
});

const MentionNotifications = () => {
  const toggleButton = (
    <NotificationTypeToggle
      notificationType="mentionNotificationsDisabled"
      toastTextEnabled={formatText(MSG.toastMentionNotificationsEnabled)}
      toastTextDisabled={formatText(MSG.toastMentionNotificationsDisabled)}
    />
  );

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
