import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useGetColonyForNotificationQuery, NotificationType } from '~gql';
import { type Notification as NotificationInterface } from '~types/notifications.ts';
import { formatText } from '~utils/intl.ts';

import ActionNotification from './Action/ActionNotification.tsx';
import ExpenditureNotification from './Expenditure/ExpenditureNotification.tsx';
import ExtensionNotification from './Extension/ExtensionNotification.tsx';
import FundsClaimedNotification from './FundsClaimed/FundsClaimedNotification.tsx';
import NewColonyVersionNotification from './NewColonyVersion/NewColonyVersion.tsx';
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
  closeUserHub: () => void;
}

const Notification: FC<NotificationProps> = ({
  notification,
  closeUserHub,
}) => {
  const { colony: currentColony } = useColonyContext();

  const { colonyAddress, notificationType, expenditureID } =
    notification.customAttributes || {};

  const { data: colonyData, loading: loadingColony } =
    useGetColonyForNotificationQuery({
      variables: {
        address: colonyAddress || '',
      },
      skip: !colonyAddress || !notificationType,
    });

  const notificationColony = colonyData?.getColonyByAddress?.items[0];

  const isCurrentColony = currentColony.name === notificationColony?.name;

  const hasExpenditureId = !!expenditureID;

  // If there is no notification type, something is wrong with this notification
  // and we won't know what to display, so skip it.
  if (!notificationType) {
    return null;
  }

  // If the notification type is permissions action, a multisig action, a motion, or a mention (always tied to an action):
  if (
    !hasExpenditureId &&
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
        colony={notificationColony}
        isCurrentColony={isCurrentColony}
        loadingColony={loadingColony}
        notification={notification}
      />
    );
  }

  // If the notification type is an expenditure update:
  // Or a motion supporting an expenditure (eg. for funding)
  if (
    hasExpenditureId &&
    [
      NotificationType.MotionCreated,
      NotificationType.MotionOpposed,
      NotificationType.MotionSupported,
      NotificationType.MotionVoting,
      NotificationType.MotionReveal,
      NotificationType.MotionFinalized,
      NotificationType.ExpenditureReadyForReview,
      NotificationType.ExpenditureReadyForFunding,
      NotificationType.ExpenditureReadyForRelease,
      NotificationType.ExpenditureFinalized,
      NotificationType.ExpenditureCancelled,
      NotificationType.ExpenditurePayoutClaimed,
      NotificationType.Mention,
    ].includes(notificationType)
  ) {
    return (
      <ExpenditureNotification
        colony={notificationColony}
        isCurrentColony={isCurrentColony}
        loadingColony={loadingColony}
        notification={notification}
      />
    );
  }

  if (notificationType === NotificationType.FundsClaimed) {
    return (
      <FundsClaimedNotification
        colony={notificationColony}
        loadingColony={loadingColony}
        notification={notification}
        closeUserHub={closeUserHub}
      />
    );
  }

  // If the notification type is an extension update:
  if (
    [
      NotificationType.ExtensionInstalled,
      NotificationType.ExtensionUpgraded,
      NotificationType.ExtensionEnabled,
      NotificationType.ExtensionDeprecated,
      NotificationType.ExtensionUninstalled,
      NotificationType.ExtensionSettingsChanged,
      NotificationType.NewExtensionVersion,
    ].includes(notificationType)
  ) {
    return (
      <ExtensionNotification
        colony={notificationColony}
        loadingColony={loadingColony}
        notification={notification}
        closeUserHub={closeUserHub}
      />
    );
  }

  if (notificationType === NotificationType.NewColonyVersion) {
    return (
      <NewColonyVersionNotification
        colony={notificationColony}
        loadingColony={loadingColony}
        notification={notification}
      />
    );
  }

  return (
    <NotificationWrapper
      colony={notificationColony}
      loadingColony={loadingColony}
      notification={notification}
    >
      <NotificationMessage>{formatText(MSG.unknown)}</NotificationMessage>
    </NotificationWrapper>
  );
};

Notification.displayName = displayName;

export default Notification;
