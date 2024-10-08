import React, { type ReactNode, useMemo, type FC } from 'react';
import { defineMessages } from 'react-intl';

import { NotificationType } from '~gql';
import { formatText } from '~utils/intl.ts';

import NotificationMessage from '../NotificationMessage.tsx';

const displayName =
  'common.Extensions.UserHub.partials.ActionNotificationMessage';

interface ActionNotificationMessageProps {
  actionMetadataDescription: ReactNode;
  actionTitle: string;
  creator: string;
  loading: boolean;
  notificationType: NotificationType;
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
  actionMetadataDescription,
  actionTitle,
  creator,
  loading,
  notificationType,
}) => {
  const Message = useMemo(() => {
    if (notificationType === NotificationType.PermissionsAction) {
      return (
        <>
          {actionTitle ? `${actionTitle}: ` : ''}
          {actionMetadataDescription || formatText(MSG.unknownAction)}
        </>
      );
    }

    if (notificationType === NotificationType.Mention) {
      const firstPart = formatText(MSG.mention, {
        name: creator || formatText(MSG.someone),
      });

      const secondPart =
        actionTitle ||
        actionMetadataDescription ||
        formatText(MSG.unknownAction);

      return (
        <>
          {firstPart} {secondPart}
        </>
      );
    }

    return formatText(MSG.unknownAction);
  }, [actionMetadataDescription, actionTitle, creator, notificationType]);

  return <NotificationMessage loading={loading}>{Message}</NotificationMessage>;
};

ActionNotificationMessage.displayName = displayName;

export default ActionNotificationMessage;
