import React, { useMemo, type FC } from 'react';
import { defineMessages } from 'react-intl';

import { getActionTitleValues } from '~common/ColonyActions/helpers/index.ts';
import {
  type ColonyActionFragment,
  type NotificationColonyFragment,
  type ExpenditureFragment,
  NotificationType,
} from '~gql';
import { type Notification } from '~types/notifications.ts';
import { formatText } from '~utils/intl.ts';

import NotificationMessage from '../NotificationMessage.tsx';

const displayName =
  'common.Extensions.UserHub.partials.ExpenditureNotificationMessage';

interface ExpenditureNotificationMessageProps {
  action: ColonyActionFragment | null | undefined;
  colony: NotificationColonyFragment | null | undefined;
  creator: string;
  expenditure: ExpenditureFragment | null | undefined;
  loading: boolean;
  notification: Notification;
}

const MSG = defineMessages({
  finalized: {
    id: `${displayName}.finalized`,
    defaultMessage: 'Payment made:',
  },
  cancelled: {
    id: `${displayName}.cancelled`,
    defaultMessage: 'Payment cancelled:',
  },
  funding: {
    id: `${displayName}.funding`,
    defaultMessage: 'Payment ready for funding:',
  },
  release: {
    id: `${displayName}.release`,
    defaultMessage: 'Payment funded:',
  },
  unknownAction: {
    id: `${displayName}.unknownAction`,
    defaultMessage: 'A payment was updated',
  },
  unknownChange: {
    id: `${displayName}.unknownChange`,
    defaultMessage: 'Payment updated: ',
  },
});

const ExpenditureNotificationMessage: FC<
  ExpenditureNotificationMessageProps
> = ({ action, colony, creator, expenditure, loading, notification }) => {
  const { notificationType } = notification.customAttributes || {};

  const actionMetadataDescription = useMemo(() => {
    if (!expenditure || !action || !colony) {
      return formatText(MSG.unknownAction);
    }

    return formatText(
      { id: 'action.title' },
      getActionTitleValues({
        actionData: action,
        colony: {
          nativeToken: {
            ...colony.nativeToken,
          },
          metadata: colony.metadata,
        },
        expenditureData: expenditure,
      }),
    );
  }, [action, colony, expenditure]);

  const Message = useMemo(() => {
    if (!expenditure || !creator || !action || !notificationType) {
      return formatText(MSG.unknownAction);
    }

    // If this is an "Expenditure ready for review" action, we simply display it in the same way as an "action created" notification.
    if (notificationType === NotificationType.ExpenditureReadyForReview) {
      return (
        <>
          {action.metadata?.customTitle}: {actionMetadataDescription}
        </>
      );
    }

    const firstPart = {
      [NotificationType.ExpenditureReadyForFunding]: formatText(MSG.funding),
      [NotificationType.ExpenditureReadyForRelease]: formatText(MSG.release),
      [NotificationType.ExpenditureCancelled]: formatText(MSG.cancelled),
      [NotificationType.ExpenditureFinalized]: formatText(MSG.finalized),
      default: formatText(MSG.unknownChange),
    }[notificationType];

    return (
      <>
        {firstPart} {action.metadata?.customTitle || actionMetadataDescription}
      </>
    );
  }, [
    action,
    actionMetadataDescription,
    creator,
    expenditure,
    notificationType,
  ]);

  return <NotificationMessage loading={loading}>{Message}</NotificationMessage>;
};

ExpenditureNotificationMessage.displayName = displayName;

export default ExpenditureNotificationMessage;
