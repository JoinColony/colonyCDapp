import { BellRinging, BellSimpleSlash } from '@phosphor-icons/react';
import React, { useCallback, useState } from 'react';
import { defineMessages, type MessageDescriptor } from 'react-intl';
import { toast } from 'react-toastify';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useNotificationsUserContext } from '~context/Notifications/NotificationsUserContext/NotificationsUserContext.ts';
import { useUpdateUserNotificationDataMutation } from '~gql';
import Toast from '~shared/Extensions/Toast/index.ts';
import { formatText } from '~utils/intl.ts';
import { type DropdownMenuItem } from '~v5/common/DropdownMenu/types.ts';

const ITEM_KEY = 'headerDropdown.section3.toggleMute';

// Disabling this eslint rule since it seems that it is a false positive. There is only one export from this file,
// but for some reason if we keep MSG outside of the hook it thinks that there is two exports. It does not break the fast refresh.

// eslint-disable-next-line react-refresh/only-export-components
const MSG = defineMessages({
  mute: {
    id: 'headerDropdown.muteNotifications',
    defaultMessage: 'Mute notifications',
  },
  unmute: {
    id: 'headerDropdown.unmuteNotifications',
    defaultMessage: 'Unmute notifications',
  },
  toastNotificationsUnmuted: {
    id: `headerDropdown.toastNotificationsUnmuted`,
    defaultMessage: 'You will now receive notifications from this colony.',
  },
  toastNotificationsMuted: {
    id: `headerDropdown.toastNotificationsMuted`,
    defaultMessage:
      'You will no longer receive notifications from this colony.',
  },
});

const useMuteColonyItem = (): DropdownMenuItem => {
  const { user, updateUser } = useAppContext();
  const {
    colony: { colonyAddress },
  } = useColonyContext();
  const { mutedColonyAddresses } = useNotificationsUserContext();
  const [updateMutedColonies] = useUpdateUserNotificationDataMutation();

  // we don't use loading here, because we want to stop loading after the data is refetched
  // Maybe an optimistic response would be better here?
  const [isMuteToggling, setIsMuteToggling] = useState(false);

  const isColonyMuted = mutedColonyAddresses.includes(colonyAddress);

  const showSuccessToast = (message: MessageDescriptor) => {
    toast.success(
      <Toast
        type="success"
        title={{ id: 'advancedSettings.toast.changesSaved' }}
        description={formatText(message)}
      />,
    );
  };

  const handleUnmuteColonyNotifications = useCallback(() => {
    if (!user) {
      return;
    }
    setIsMuteToggling(true);

    updateMutedColonies({
      variables: {
        input: {
          userAddress: user.walletAddress,
          mutedColonyAddresses: mutedColonyAddresses.filter(
            (mutedColonyAddress) => mutedColonyAddress !== colonyAddress,
          ),
        },
      },
      onCompleted: async () => {
        await updateUser(user.walletAddress, true);
        setIsMuteToggling(false);
        showSuccessToast(MSG.toastNotificationsUnmuted);
      },
    });
  }, [
    colonyAddress,
    mutedColonyAddresses,
    updateMutedColonies,
    updateUser,
    user,
  ]);

  const handleMuteColonyNotifications = useCallback(() => {
    if (!user) {
      return;
    }
    setIsMuteToggling(true);

    updateMutedColonies({
      variables: {
        input: {
          userAddress: user.walletAddress,
          mutedColonyAddresses: [...mutedColonyAddresses, colonyAddress],
        },
      },
      onCompleted: async () => {
        await updateUser(user.walletAddress, true);
        setIsMuteToggling(false);
        showSuccessToast(MSG.toastNotificationsMuted);
      },
    });
  }, [
    colonyAddress,
    mutedColonyAddresses,
    updateMutedColonies,
    updateUser,
    user,
  ]);

  if (isColonyMuted) {
    return {
      key: ITEM_KEY,
      label: formatText(MSG.unmute),
      icon: BellRinging,
      onClick: handleUnmuteColonyNotifications,
      disabled: isMuteToggling,
    };
  }

  return {
    key: ITEM_KEY,
    label: formatText(MSG.mute),
    icon: BellSimpleSlash,
    onClick: handleMuteColonyNotifications,
    disabled: isMuteToggling,
  };
};

export default useMuteColonyItem;
