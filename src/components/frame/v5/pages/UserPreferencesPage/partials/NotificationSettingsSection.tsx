import React from 'react';
import { defineMessages } from 'react-intl';

import { useNotificationsUserContext } from '~context/Notifications/NotificationsUserContext/NotificationsUserContext.ts';
import { formatText } from '~utils/intl.ts';
import SettingsRow from '~v5/common/SettingsRow/index.ts';

import AdminNotifications from './AdminNotifications.tsx';
import MentionNotifications from './MentionNotifications.tsx';
import NotificationsDisabledBanner from './NotificationsDisabledBanner.tsx';
import PaymentNotifications from './PaymentNotifications.tsx';

const displayName =
  'v5.pages.UserPreferencesPage.partials.NotificationSettingsSection';

const MSG = defineMessages({
  sectionTitle: {
    id: `${displayName}.sectionTitle`,
    defaultMessage: 'Notification preferences',
  },
});

const NotificationSettingsSection = () => {
  const { areNotificationsEnabled } = useNotificationsUserContext();

  return (
    <SettingsRow.Container className="border-b-0">
      <SettingsRow.Title>{formatText(MSG.sectionTitle)}</SettingsRow.Title>
      {areNotificationsEnabled ? (
        <>
          <PaymentNotifications />
          <MentionNotifications />
          <AdminNotifications />
        </>
      ) : (
        <NotificationsDisabledBanner />
      )}
    </SettingsRow.Container>
  );
};

NotificationSettingsSection.displayName = displayName;
export default NotificationSettingsSection;
