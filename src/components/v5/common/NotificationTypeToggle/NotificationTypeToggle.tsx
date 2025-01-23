import React, { type FC, useState } from 'react';
import { toast } from 'react-toastify';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useUpdateUserNotificationDataMutation } from '~gql';
import Toast from '~shared/Extensions/Toast/index.ts';
import { formatText } from '~utils/intl.ts';
import Switch from '~v5/common/Fields/Switch/index.ts';

const displayName = 'v5.common.NotificationTypeToggle';

interface NotificationTypeToggleProps {
  toastTextEnabled: string;
  toastTextDisabled: string;
  notificationType:
    | 'adminNotificationsDisabled'
    | 'notificationsDisabled'
    | 'mentionNotificationsDisabled'
    | 'paymentNotificationsDisabled';
  testId?: string;
}

const NotificationTypeToggle: FC<NotificationTypeToggleProps> = ({
  notificationType,
  toastTextDisabled,
  toastTextEnabled,
  testId,
}) => {
  const { user, updateUser } = useAppContext();
  const [isNotificationTypeDisabled, setIsNotificationTypeDisabled] = useState(
    user?.notificationsData?.[notificationType] ?? false,
  );

  const [updateNotificationTypeMuted, { loading }] =
    useUpdateUserNotificationDataMutation();

  const handleUpdateNotificationTypeMuted = async (
    disabled: boolean,
  ): Promise<void> => {
    if (!user) {
      return;
    }
    await updateNotificationTypeMuted({
      variables: {
        input: {
          userAddress: user.walletAddress,
          [notificationType]: disabled,
        },
      },
    });
    await updateUser(user.walletAddress, true);
    setIsNotificationTypeDisabled(disabled);

    toast.success(
      <Toast
        type="success"
        title={{ id: 'advancedSettings.toast.changesSaved' }}
        description={formatText(
          disabled ? toastTextDisabled : toastTextEnabled,
        )}
      />,
    );
  };

  return (
    <Switch
      checked={!isNotificationTypeDisabled}
      disabled={loading}
      onChange={async () => {
        await handleUpdateNotificationTypeMuted(!isNotificationTypeDisabled);
      }}
      testId={testId}
    />
  );
};

NotificationTypeToggle.displayName = displayName;
export default NotificationTypeToggle;
