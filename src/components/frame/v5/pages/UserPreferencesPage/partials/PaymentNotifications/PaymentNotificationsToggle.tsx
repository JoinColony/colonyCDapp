import React, { useState } from 'react';
import { defineMessages } from 'react-intl';
import { toast } from 'react-toastify';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useUpdateUserNotificationDataMutation } from '~gql';
import Toast from '~shared/Extensions/Toast/index.ts';
import { formatText } from '~utils/intl.ts';
import Switch from '~v5/common/Fields/Switch/index.ts';

const displayName =
  'v5.pages.UserPreferencesPage.partials.PaymentNotificationsToggle';

const MSG = defineMessages({
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

const PaymentNotificationsToggle = () => {
  const { user, updateUser } = useAppContext();
  const [arePaymentNotificationsDisabled, setArePaymentNotificationsDisabled] =
    useState(user?.notificationsData?.paymentNotificationsDisabled ?? false);

  const [updatePaymentNotificationsMuted, { loading }] =
    useUpdateUserNotificationDataMutation();

  const handleUpdatePaymentNotificationsMuted = async (
    disabled: boolean,
  ): Promise<void> => {
    if (!user) {
      return;
    }
    await updatePaymentNotificationsMuted({
      variables: {
        input: {
          userAddress: user.walletAddress,
          paymentNotificationsDisabled: disabled,
        },
      },
    });
    await updateUser(user.walletAddress, true);
    setArePaymentNotificationsDisabled(disabled);

    toast.success(
      <Toast
        type="success"
        title={{ id: 'advancedSettings.toast.changesSaved' }}
        description={formatText(
          disabled
            ? MSG.toastPaymentNotificationsDisabled
            : MSG.toastPaymentNotificationsEnabled,
        )}
      />,
    );
  };

  return (
    <Switch
      checked={!arePaymentNotificationsDisabled}
      disabled={loading}
      onChange={async () => {
        await handleUpdatePaymentNotificationsMuted(
          !arePaymentNotificationsDisabled,
        );
      }}
    />
  );
};

PaymentNotificationsToggle.displayName = displayName;
export default PaymentNotificationsToggle;
