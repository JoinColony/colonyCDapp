import React, { useState } from 'react';
import { defineMessages } from 'react-intl';
import { toast } from 'react-toastify';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useUpdateUserNotificationDataMutation } from '~gql';
import Toast from '~shared/Extensions/Toast/index.ts';
import { formatText } from '~utils/intl.ts';
import Switch from '~v5/common/Fields/Switch/index.ts';

const displayName =
  'v5.pages.UserPreferencesPage.partials.MentionNotificationsToggle';

const MSG = defineMessages({
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

const MentionNotificationsToggle = () => {
  const { user, updateUser } = useAppContext();
  const [areMentionNotificationsDisabled, setAreMentionNotificationsDisabled] =
    useState(user?.notificationsData?.mentionNotificationsDisabled ?? false);

  const [updateMentionNotificationsMuted, { loading }] =
    useUpdateUserNotificationDataMutation();

  const handleUpdateMentionNotificationsMuted = async (
    disabled: boolean,
  ): Promise<void> => {
    if (!user) {
      return;
    }
    await updateMentionNotificationsMuted({
      variables: {
        input: {
          userAddress: user.walletAddress,
          mentionNotificationsDisabled: disabled,
        },
      },
    });
    await updateUser(user.walletAddress, true);
    setAreMentionNotificationsDisabled(disabled);

    toast.success(
      <Toast
        type="success"
        title={{ id: 'advancedSettings.toast.changesSaved' }}
        description={formatText(
          disabled
            ? MSG.toastMentionNotificationsDisabled
            : MSG.toastMentionNotificationsEnabled,
        )}
      />,
    );
  };

  return (
    <Switch
      checked={!areMentionNotificationsDisabled}
      disabled={loading}
      onChange={async () => {
        await handleUpdateMentionNotificationsMuted(
          !areMentionNotificationsDisabled,
        );
      }}
    />
  );
};

MentionNotificationsToggle.displayName = displayName;
export default MentionNotificationsToggle;
