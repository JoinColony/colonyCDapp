import React, { useState } from 'react';
import { defineMessages } from 'react-intl';
import { toast } from 'react-toastify';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useUpdateUserGlobalNotificationsMutedMutation } from '~gql';
import Toast from '~shared/Extensions/Toast/index.ts';
import { formatText } from '~utils/intl.ts';
import Switch from '~v5/common/Fields/Switch/index.ts';

const displayName =
  'v5.pages.UserAdvancedPage.partials.MetaTransactionsSection.partials.NotificationsToggle';

const MSG = defineMessages({
  toastNotificationsEnabled: {
    id: `${displayName}.toastNotificationsEnabled`,
    defaultMessage: 'You will now receive notifications.',
  },
  toastNotificationsDisabled: {
    id: `${displayName}.toastNotificationsEnabled`,
    defaultMessage: 'You will no longer receive notifications.',
  },
});

const NotificationsToggle = () => {
  const { user, updateUser } = useAppContext();
  const [areNotificationsDisabled, setAreNotificationsDisabled] = useState(
    user?.notificationsData?.notificationsDisabled ?? false,
  );

  const [updateNotificationsMuted, { loading }] =
    useUpdateUserGlobalNotificationsMutedMutation();

  const handleUpdateNotificationsMuted = async (
    disabled: boolean,
  ): Promise<void> => {
    if (!user) {
      return;
    }
    await updateNotificationsMuted({
      variables: {
        disabled,
        userAddress: user.walletAddress,
      },
    });
    await updateUser(user.walletAddress, true);
    setAreNotificationsDisabled(disabled);

    toast.success(
      <Toast
        type="success"
        title={{ id: 'advancedSettings.toast.changesSaved' }}
        description={formatText(
          disabled
            ? MSG.toastNotificationsDisabled
            : MSG.toastNotificationsEnabled,
        )}
      />,
    );
  };

  return (
    <Switch
      checked={!areNotificationsDisabled}
      disabled={loading}
      onChange={async () => {
        await handleUpdateNotificationsMuted(!areNotificationsDisabled);
      }}
    />
  );
};

NotificationsToggle.displayName = displayName;
export default NotificationsToggle;
