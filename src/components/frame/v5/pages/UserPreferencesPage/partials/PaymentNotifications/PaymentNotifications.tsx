import React from 'react';
import { defineMessages } from 'react-intl';

import { formatText } from '~utils/intl.ts';
import SettingsRow from '~v5/common/SettingsRow/index.ts';

import PaymentNotificationsToggle from './PaymentNotificationsToggle.tsx';

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
});

const PaymentNotifications = () => {
  const toggleButton = <PaymentNotificationsToggle />;

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
