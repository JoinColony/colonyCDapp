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
  actionCreated: {
    id: `${displayName}.actionCreated`,
    defaultMessage: 'Permissions used:',
  },
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
    const firstPart = {
      [NotificationType.PermissionsAction]: formatText(MSG.actionCreated),
      [NotificationType.Mention]: formatText(MSG.mention, {
        name: creator || formatText(MSG.someone),
      }),
    }[notificationType];

    const secondPart =
      actionTitle || actionMetadataDescription || formatText(MSG.unknownAction);

    return (
      <>
        {firstPart} {secondPart}
      </>
    );
  }, [actionMetadataDescription, actionTitle, creator, notificationType]);

  return <NotificationMessage loading={loading}>{Message}</NotificationMessage>;
};

ActionNotificationMessage.displayName = displayName;

export default ActionNotificationMessage;
