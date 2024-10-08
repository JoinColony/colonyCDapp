import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { useGetColonyForNotificationQuery, NotificationType } from '~gql';
import { type Notification as NotificationInterface } from '~types/notifications.ts';
import { formatText } from '~utils/intl.ts';

import ActionNotification from './Action/ActionNotification.tsx';
import ExpenditureNotification from './Expenditure/ExpenditureNotification.tsx';
import FundsClaimedNotification from './FundsClaimed/FundsClaimedNotification.tsx';
import NotificationMessage from './NotificationMessage.tsx';
import NotificationWrapper from './NotificationWrapper.tsx';

const displayName = 'common.Extensions.UserHub.partials.Notification';

const MSG = defineMessages({
  unknown: {
    id: `${displayName}.unknown`,
    defaultMessage: 'Unknown notification',
  },
});

interface NotificationProps {
  notification: NotificationInterface;
}

const Notification: FC<NotificationProps> = ({ notification }) => {
  const { colonyAddress, notificationType } =
    notification.customAttributes || {};

  const { data: colonyData, loading: loadingColony } =
    useGetColonyForNotificationQuery({
      variables: {
        address: colonyAddress || '',
      },
      skip: !colonyAddress || !notificationType,
    });

  const colony = colonyData?.getColonyByAddress?.items[0];

  // If there is no notification type, something is wrong with this notification
  // and we won't know what to display, so skip it.
  if (!notificationType) {
    return null;
  }

  // If the notification type is permissions action, a multisig action, a motion, or a mention (always tied to an action):
  if (
    [
      NotificationType.PermissionsAction,
      NotificationType.Mention,
      NotificationType.MotionCreated,
      NotificationType.MotionOpposed,
      NotificationType.MotionSupported,
      NotificationType.MotionVoting,
      NotificationType.MotionReveal,
      NotificationType.MotionFinalized,
      NotificationType.MultisigActionCreated,
      NotificationType.MultisigActionFinalized,
      NotificationType.MultisigActionApproved,
      NotificationType.MultisigActionRejected,
    ].includes(notificationType)
  ) {
    return (
      <ActionNotification
        colony={colony}
        loadingColony={loadingColony}
        notification={notification}
      />
    );
  }

  // If the notification type is an expenditure update:
  if (
    [
      NotificationType.ExpenditureReadyForReview,
      NotificationType.ExpenditureReadyForFunding,
      NotificationType.ExpenditureReadyForRelease,
      NotificationType.ExpenditureFinalized,
      NotificationType.ExpenditureCancelled,
    ].includes(notificationType)
  ) {
    return (
      <ExpenditureNotification
        colony={colony}
        loadingColony={loadingColony}
        notification={notification}
      />
    );
  }

  if (notificationType === NotificationType.FundsClaimed) {
    return (
      <FundsClaimedNotification
        colony={colony}
        loadingColony={loadingColony}
        notification={notification}
      />
    );
  }

  return (
    <NotificationWrapper
      colony={colony}
      loadingColony={loadingColony}
      notification={notification}
    >
      <NotificationMessage>{formatText(MSG.unknown)}</NotificationMessage>
    </NotificationWrapper>
  );
};

Notification.displayName = displayName;

export default Notification;
