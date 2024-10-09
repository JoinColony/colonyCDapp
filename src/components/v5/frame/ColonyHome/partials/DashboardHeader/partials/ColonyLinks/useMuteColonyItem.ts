import { BellRinging, BellSimpleSlash } from '@phosphor-icons/react';
import { useCallback, useState } from 'react';
import { defineMessages } from 'react-intl';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useNotificationsUserContext } from '~context/Notifications/NotificationsUserContext/NotificationsUserContext.ts';
import { useUpdateUserNotificationDataMutation } from '~gql';
import { formatText } from '~utils/intl.ts';
import { type DropdownMenuItem } from '~v5/common/DropdownMenu/types.ts';

const MSG = defineMessages({
  mute: {
    id: 'headerDropdown.muteNotifications',
    defaultMessage: 'Mute notifications',
  },
  unmute: {
    id: 'headerDropdown.unmuteNotifications',
    defaultMessage: 'Unmute notifications',
  },
  muting: {
    id: 'headerDropdown.mutingNotifications',
    defaultMessage: 'Muting...',
  },
  unmuting: {
    id: 'headerDropdown.unmutingNotifications',
    defaultMessage: 'Unmuting...',
  },
});

const ITEM_KEY = 'headerDropdown.section3.toggleMute';

export const useMuteColonyItem = (): DropdownMenuItem => {
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
    if (isMuteToggling) {
      return {
        key: ITEM_KEY,
        label: formatText(MSG.unmuting),
        icon: BellSimpleSlash,
        disabled: true,
      };
    }

    return {
      key: ITEM_KEY,
      label: formatText(MSG.unmute),
      icon: BellRinging,
      onClick: handleUnmuteColonyNotifications,
    };
  }

  // if unmuted and mutation is in place, we are muting it
  if (isMuteToggling) {
    return {
      key: ITEM_KEY,
      label: formatText(MSG.muting),
      icon: BellRinging,
      disabled: true,
    };
  }

  return {
    key: ITEM_KEY,
    label: formatText(MSG.mute),
    icon: BellSimpleSlash,
    onClick: handleMuteColonyNotifications,
  };
};
