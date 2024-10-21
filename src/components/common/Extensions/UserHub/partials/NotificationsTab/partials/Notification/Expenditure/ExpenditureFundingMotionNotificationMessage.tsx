import React, { useMemo, type FC } from 'react';
import { defineMessages } from 'react-intl';

import { NotificationType } from '~gql';
import { formatText } from '~utils/intl.ts';

import NotificationMessage from '../NotificationMessage.tsx';

const displayName =
  'common.Extensions.UserHub.partials.ExpenditureMotionNotificationMessage';

interface ExpenditureFundingMotionNotificationMessageProps {
  actionTitle: string;
  loading: boolean;
  notificationType: NotificationType;
}

const MSG = defineMessages({
  opposed: {
    id: `${displayName}.opposed`,
    defaultMessage: 'Opposed, will fail: Funding for {action}',
  },
  supported: {
    id: `${displayName}.supported`,
    defaultMessage: 'Supported, will pass: Funding for {action}',
  },
  voting: {
    id: `${displayName}.opposed`,
    defaultMessage: 'Voting started: Funding for {action}',
  },
  reveal: {
    id: `${displayName}.reveal`,
    defaultMessage: 'Reveal votes: Funding for {action}',
  },
  finalized: {
    id: `${displayName}.finalized`,
    defaultMessage: 'Finalized: Funding for {action}',
  },
  created: {
    id: `${displayName}.created`,
    defaultMessage: 'Reputation decision: Funding for {action}',
  },
  unknownChange: {
    id: `${displayName}.unknownChange`,
    defaultMessage: 'Action updated: Funding for {action}',
  },
});

const ExpenditureFundingMotionNotificationMessage: FC<
  ExpenditureFundingMotionNotificationMessageProps
> = ({ actionTitle, loading, notificationType }) => {
  const Message = useMemo(() => {
    const msgKey = {
      [NotificationType.MotionCreated]: MSG.created,
      [NotificationType.MotionOpposed]: MSG.opposed,
      [NotificationType.MotionSupported]: MSG.supported,
      [NotificationType.MotionVoting]: MSG.voting,
      [NotificationType.MotionReveal]: MSG.reveal,
      [NotificationType.MotionFinalized]: MSG.finalized,
    }[notificationType];

    return <>{formatText(msgKey, { action: actionTitle })}</>;
  }, [actionTitle, notificationType]);

  return <NotificationMessage loading={loading}>{Message}</NotificationMessage>;
};

ExpenditureFundingMotionNotificationMessage.displayName = displayName;

export default ExpenditureFundingMotionNotificationMessage;
