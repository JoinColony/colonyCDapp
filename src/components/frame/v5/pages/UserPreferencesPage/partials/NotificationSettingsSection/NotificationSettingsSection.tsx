import React from 'react';
import { defineMessages } from 'react-intl';

import { formatText } from '~utils/intl.ts';
import SettingsRow from '~v5/common/SettingsRow/index.ts';

import AdminNotifications from '../AdminNotifications/AdminNotifications.tsx';
import MentionNotifications from '../MentionNotifications/MentionNotifications.tsx';
import PaymentNotifications from '../PaymentNotifications/PaymentNotifications.tsx';

const displayName =
  'v5.pages.UserPreferencesPage.partials.NotificationSettingsSection';

const MSG = defineMessages({
  sectionTitle: {
    id: `${displayName}.sectionTitle`,
    defaultMessage: 'Notification preferences',
  },
});

const NotificationSettingsSection = () => {
  return (
    <SettingsRow.Container className="border-b-0">
      <SettingsRow.Title>{formatText(MSG.sectionTitle)}</SettingsRow.Title>
      <PaymentNotifications />
      <MentionNotifications />
      <AdminNotifications />
    </SettingsRow.Container>
  );
};

NotificationSettingsSection.displayName = displayName;
export default NotificationSettingsSection;
