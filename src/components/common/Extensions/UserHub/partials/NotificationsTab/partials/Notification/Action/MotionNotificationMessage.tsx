import React, { useMemo, type FC } from 'react';
import { defineMessages } from 'react-intl';

import { NotificationType } from '~gql';
import { type RequireProps } from '~types';
import { formatText } from '~utils/intl.ts';

import NotificationMessage from '../NotificationMessage.tsx';
import { type BaseNotificationMessageProps } from '../types.ts';

const displayName =
  'common.Extensions.UserHub.partials.MotionNotificationMessage';

const MSG = defineMessages({
  created: {
    id: `${displayName}.created`,
    defaultMessage: 'Reputation decision:',
  },
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
});

const MotionNotificationMessage: FC<
  RequireProps<BaseNotificationMessageProps, 'notificationType'>
> = ({ actionMetadataDescription, actionTitle, loading, notificationType }) => {
  const Message = useMemo(() => {
    const firstPart = {
      [NotificationType.MotionCreated]: formatText(MSG.created),
      [NotificationType.MotionOpposed]: formatText(MSG.opposed),
      [NotificationType.MotionSupported]: formatText(MSG.supported),
      [NotificationType.MotionVoting]: formatText(MSG.voting),
      [NotificationType.MotionReveal]: formatText(MSG.reveal),
      [NotificationType.MotionFinalized]: formatText(MSG.finalized),
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
