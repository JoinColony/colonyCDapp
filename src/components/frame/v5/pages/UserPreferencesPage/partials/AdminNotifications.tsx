import React from 'react';
import { defineMessages } from 'react-intl';

import { formatText } from '~utils/intl.ts';
import NotificationTypeToggle from '~v5/common/NotificationTypeToggle/NotificationTypeToggle.tsx';
import SettingsRow from '~v5/common/SettingsRow/index.ts';

const displayName = 'v5.pages.UserPreferencesPage.partials.AdminNotifications';

const MSG = defineMessages({
  adminTitle: {
    id: `${displayName}.adminTitle`,
    defaultMessage: 'Operations and admin',
  },
  adminDescription: {
    id: `${displayName}.adminDescription`,
    defaultMessage:
      'Operations and admin related actions such as creating a team, upgrades, installs, etc',
  },
  toastAdminNotificationsEnabled: {
    id: `${displayName}.toastAdminNotificationsEnabled`,
    defaultMessage: 'You will now receive operations and admin notifications.',
  },
  toastAdminNotificationsDisabled: {
    id: `${displayName}.toastAdminNotificationsDisabled`,
    defaultMessage:
      'You will no longer receive operations and admin notifications.',
  },
});

const toggleButton = (
  <NotificationTypeToggle
    testId="admin-notifications-toggle"
    toastTextEnabled={formatText(MSG.toastAdminNotificationsEnabled)}
    toastTextDisabled={formatText(MSG.toastAdminNotificationsDisabled)}
    notificationType="adminNotificationsDisabled"
  />
);

const AdminNotifications = () => {
  return (
    <SettingsRow.Content rightContent={toggleButton}>
      <SettingsRow.Subtitle>{formatText(MSG.adminTitle)}</SettingsRow.Subtitle>
      <SettingsRow.Description>
        {formatText(MSG.adminDescription)}
      </SettingsRow.Description>
    </SettingsRow.Content>
  );
};

AdminNotifications.displayName = displayName;
export default AdminNotifications;
