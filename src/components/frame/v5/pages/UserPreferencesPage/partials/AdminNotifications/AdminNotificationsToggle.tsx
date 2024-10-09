import React, { useState } from 'react';
import { defineMessages } from 'react-intl';
import { toast } from 'react-toastify';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useUpdateUserNotificationDataMutation } from '~gql';
import Toast from '~shared/Extensions/Toast/index.ts';
import { formatText } from '~utils/intl.ts';
import Switch from '~v5/common/Fields/Switch/index.ts';

const displayName =
  'v5.pages.UserPreferencesPage.partials.AdminNotificationsToggle';

const MSG = defineMessages({
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

const AdminNotificationsToggle = () => {
  const { user, updateUser } = useAppContext();
  const [areAdminNotificationsDisabled, setAreAdminNotificationsDisabled] =
    useState(user?.notificationsData?.adminNotificationsDisabled ?? false);

  const [updateAdminNotificationsMuted, { loading }] =
    useUpdateUserNotificationDataMutation();

  const handleUpdateAdminNotificationsMuted = async (
    disabled: boolean,
  ): Promise<void> => {
    if (!user) {
      return;
    }
    await updateAdminNotificationsMuted({
      variables: {
        input: {
          userAddress: user.walletAddress,
          adminNotificationsDisabled: disabled,
        },
      },
    });
    await updateUser(user.walletAddress, true);
    setAreAdminNotificationsDisabled(disabled);

    toast.success(
      <Toast
        type="success"
        title={{ id: 'advancedSettings.toast.changesSaved' }}
        description={formatText(
          disabled
            ? MSG.toastAdminNotificationsDisabled
            : MSG.toastAdminNotificationsEnabled,
        )}
      />,
    );
  };

  return (
    <Switch
      checked={!areAdminNotificationsDisabled}
      disabled={loading}
      onChange={async () => {
        await handleUpdateAdminNotificationsMuted(
          !areAdminNotificationsDisabled,
        );
      }}
    />
  );
};

AdminNotificationsToggle.displayName = displayName;
export default AdminNotificationsToggle;
