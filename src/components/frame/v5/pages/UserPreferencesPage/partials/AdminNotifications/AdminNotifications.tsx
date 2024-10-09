import React from 'react';
import { defineMessages } from 'react-intl';

import { formatText } from '~utils/intl.ts';
import SettingsRow from '~v5/common/SettingsRow/index.ts';

import AdminNotificationsToggle from './AdminNotificationsToggle.tsx';

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
});

const AdminNotifications = () => {
  const toggleButton = <AdminNotificationsToggle />;

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
