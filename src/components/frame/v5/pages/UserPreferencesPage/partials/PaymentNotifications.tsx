import React from 'react';
import { defineMessages } from 'react-intl';

import { formatText } from '~utils/intl.ts';
import NotificationTypeToggle from '~v5/common/NotificationTypeToggle/NotificationTypeToggle.tsx';
import SettingsRow from '~v5/common/SettingsRow/index.ts';

const displayName =
  'v5.pages.UserPreferencesPage.partials.PaymentNotifications';

const MSG = defineMessages({
  paymentsTitle: {
    id: `${displayName}.paymentsTitle`,
    defaultMessage: 'Payments and funds',
  },
  paymentsDescription: {
    id: `${displayName}.paymentsDescription`,
    defaultMessage:
      'Receive a notification when any payment related actions are performed across joined colonies',
  },
  toastPaymentNotificationsEnabled: {
    id: `${displayName}.toastPaymentNotificationsEnabled`,
    defaultMessage:
      'You will now receive notifications for payment related actions.',
  },
  toastPaymentNotificationsDisabled: {
    id: `${displayName}.toastPaymentNotificationsDisabled`,
    defaultMessage:
      'You will no longer receive notifications for payment related actions.',
  },
});

const toggleButton = (
  <NotificationTypeToggle
    testId="payment-notifications-toggle"
    notificationType="paymentNotificationsDisabled"
    toastTextEnabled={formatText(MSG.toastPaymentNotificationsEnabled)}
    toastTextDisabled={formatText(MSG.toastPaymentNotificationsDisabled)}
  />
);

const PaymentNotifications = () => {
  return (
    <SettingsRow.Content rightContent={toggleButton}>
      <SettingsRow.Subtitle>
        {formatText(MSG.paymentsTitle)}
      </SettingsRow.Subtitle>
      <SettingsRow.Description>
        {formatText(MSG.paymentsDescription)}
      </SettingsRow.Description>
    </SettingsRow.Content>
  );
};

PaymentNotifications.displayName = displayName;
export default PaymentNotifications;
