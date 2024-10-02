import React, { useMemo, type FC } from 'react';
import { defineMessages } from 'react-intl';

import { getActionTitleValues } from '~common/ColonyActions/helpers/index.ts';
import { type ColonyActionFragment, type ColonyFragment } from '~gql';
import { useAmountLessFee } from '~hooks/useAmountLessFee.ts';
import { NotificationType, type Notification } from '~types/notifications.ts';
import { formatText } from '~utils/intl.ts';

import NotificationMessage from '../NotificationMessage.tsx';

const displayName =
  'common.Extensions.UserHub.partials.ActionNotificationMessage';

interface ActionNotificationMessageProps {
  action: ColonyActionFragment | null | undefined;
  colony: ColonyFragment | null | undefined;
  creator: string;
  loading: boolean;
  notification: Notification;
}

const MSG = defineMessages({
  mention: {
    id: `${displayName}.mention`,
    defaultMessage: '{name} has mentioned you in: ',
  },
  someone: {
    id: `${displayName}.someone`,
    defaultMessage: 'Someone',
  },
  unknownAction: {
    id: `${displayName}.unknownAction`,
    defaultMessage: 'Unknown action',
  },
});

const ActionNotificationMessage: FC<ActionNotificationMessageProps> = ({
  action,
  colony,
  creator,
  loading,
  notification,
}) => {
  const amountLessFee = useAmountLessFee(action?.amount, action?.networkFee);

  const actionMetadataDescription = useMemo(() => {
    if (!action || !colony) {
      return formatText(MSG.unknownAction);
    }

    return formatText(
      { id: 'action.title' },
      getActionTitleValues({
        actionData: { ...action, amount: amountLessFee },
        colony: {
          nativeToken: {
            ...colony.nativeToken,
          },
          metadata: colony.metadata,
        },
      }),
    );
  }, [action, amountLessFee, colony]);

  const Message = useMemo(() => {
    if (
      !creator ||
      !action ||
      !notification.customAttributes?.notificationType
    ) {
      return formatText(MSG.unknownAction);
    }

    if (
      notification.customAttributes?.notificationType ===
      NotificationType.PermissionsAction
    ) {
      return (
        <>
          {action.metadata?.customTitle && `${action.metadata?.customTitle}: `}
          {actionMetadataDescription}
        </>
      );
    }

    if (
      notification.customAttributes?.notificationType ===
      NotificationType.Mention
    ) {
      return (
        <>
          {formatText(MSG.mention, {
            name: creator || formatText(MSG.someone),
          })}
          {action.metadata?.customTitle || actionMetadataDescription}
        </>
      );
    }

    return null;
  }, [
    action,
    actionMetadataDescription,
    creator,
    notification.customAttributes?.notificationType,
  ]);

  return <NotificationMessage loading={loading}>{Message}</NotificationMessage>;
};

ActionNotificationMessage.displayName = displayName;

export default ActionNotificationMessage;
