import React, { type ReactNode, useMemo, type FC } from 'react';
import { defineMessages } from 'react-intl';

import { NotificationType } from '~gql';
import { formatText } from '~utils/intl.ts';

import NotificationMessage from '../NotificationMessage.tsx';

const displayName =
  'common.Extensions.UserHub.partials.MotionNotificationMessage';

interface MotionNotificationMessageProps {
  actionMetadataDescription: ReactNode;
  actionTitle: string;
  loading: boolean;
  notificationType: NotificationType;
}

const MSG = defineMessages({
  opposed: {
    id: `${displayName}.opposed`,
    defaultMessage: 'Opposed, will fail: ',
  },
  supported: {
    id: `${displayName}.supported`,
    defaultMessage: 'Supported, will pass: ',
  },
  voting: {
    id: `${displayName}.opposed`,
    defaultMessage: 'Voting started: ',
  },
  reveal: {
    id: `${displayName}.reveal`,
    defaultMessage: 'Reveal votes: ',
  },
  finalized: {
    id: `${displayName}.finalized`,
    defaultMessage: 'Finalized: ',
  },
  unknownAction: {
    id: `${displayName}.unknownAction`,
    defaultMessage: 'Unknown motion',
  },
  unknownChange: {
    id: `${displayName}.unknownChange`,
    defaultMessage: 'Motion updated: ',
  },
});

const MotionNotificationMessage: FC<MotionNotificationMessageProps> = ({
  actionMetadataDescription,
  actionTitle,
  loading,
  notificationType,
}) => {
  const Message = useMemo(() => {
    if (notificationType === NotificationType.MotionCreated) {
      return (
        <>
          {actionTitle ? `${actionTitle}: ` : formatText(MSG.unknownChange)}
          {actionMetadataDescription || formatText(MSG.unknownAction)}
        </>
      );
    }

    const firstPart = {
      [NotificationType.MotionOpposed]: formatText(MSG.opposed),
      [NotificationType.MotionSupported]: formatText(MSG.supported),
      [NotificationType.MotionVoting]: formatText(MSG.voting),
      [NotificationType.MotionReveal]: formatText(MSG.reveal),
      [NotificationType.MotionFinalized]: formatText(MSG.finalized),
      default: formatText(MSG.unknownChange),
    }[notificationType];

    const secondPart =
      actionTitle || actionMetadataDescription || formatText(MSG.unknownAction);

    return (
      <>
        {firstPart} {secondPart}
      </>
    );
  }, [actionMetadataDescription, actionTitle, notificationType]);

  return <NotificationMessage loading={loading}>{Message}</NotificationMessage>;
};

MotionNotificationMessage.displayName = displayName;

export default MotionNotificationMessage;
