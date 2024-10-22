import React, { useMemo, type FC, type ReactNode } from 'react';
import { defineMessages } from 'react-intl';

import { NotificationType } from '~gql';
import { formatText } from '~utils/intl.ts';

import NotificationMessage from '../NotificationMessage.tsx';

const displayName =
  'common.Extensions.UserHub.partials.ExpenditureMotionNotificationMessage';

interface ExpenditureFundingMotionNotificationMessageProps {
  actionMetadataDescription: ReactNode;
  actionTitle: string;
  loading: boolean;
  notificationType: NotificationType;
}

const MSG = defineMessages({
  opposed: {
    id: `${displayName}.opposed`,
    defaultMessage: 'Opposed, will fail:',
  },
  supported: {
    id: `${displayName}.supported`,
    defaultMessage: 'Supported, will pass:',
  },
  voting: {
    id: `${displayName}.opposed`,
    defaultMessage: 'Voting started:',
  },
  reveal: {
    id: `${displayName}.reveal`,
    defaultMessage: 'Reveal votes:',
  },
  finalized: {
    id: `${displayName}.finalized`,
    defaultMessage: 'Finalized:',
  },
  created: {
    id: `${displayName}.created`,
    defaultMessage: 'Reputation decision:',
  },
  unknownChange: {
    id: `${displayName}.unknownChange`,
    defaultMessage: 'Action updated:',
  },
  unknownAction: {
    id: `${displayName}.unknownAction`,
    defaultMessage: 'A payment was funded',
  },
  fundingFor: {
    id: `${displayName}.fundingFor`,
    defaultMessage: 'Funding for',
  },
});

const ExpenditureFundingMotionNotificationMessage: FC<
  ExpenditureFundingMotionNotificationMessageProps
> = ({ actionTitle, actionMetadataDescription, loading, notificationType }) => {
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
      actionTitle || actionMetadataDescription ? (
        <>
          {formatText(MSG.fundingFor)}{' '}
          {actionTitle || actionMetadataDescription}
        </>
      ) : (
        formatText(MSG.unknownAction)
      );

    return (
      <>
        {firstPart} {secondPart}
      </>
    );
  }, [actionTitle, actionMetadataDescription, notificationType]);

  return <NotificationMessage loading={loading}>{Message}</NotificationMessage>;
};

ExpenditureFundingMotionNotificationMessage.displayName = displayName;

export default ExpenditureFundingMotionNotificationMessage;
