import React, { type ReactNode, useMemo, type FC } from 'react';
import { defineMessages } from 'react-intl';

import { NotificationType } from '~gql';
import { formatText } from '~utils/intl.ts';

import NotificationMessage from '../NotificationMessage.tsx';

const displayName =
  'common.Extensions.UserHub.partials.ExpenditureNotificationMessage';

interface ExpenditureNotificationMessageProps {
  actionMetadataDescription: ReactNode;
  actionTitle: string;
  loading: boolean;
  notificationType: NotificationType;
}

const MSG = defineMessages({
  review: {
    id: `${displayName}.review`,
    defaultMessage: 'Payment ready for review:',
  },
  finalized: {
    id: `${displayName}.finalized`,
    defaultMessage: 'Payment released:',
  },
  payoutClaimed: {
    id: `${displayName}.payoutClaimed`,
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
});

const ExpenditureNotificationMessage: FC<
  ExpenditureNotificationMessageProps
> = ({ actionTitle, actionMetadataDescription, loading, notificationType }) => {
  const Message = useMemo(() => {
    const firstPart = {
      [NotificationType.ExpenditureReadyForReview]: formatText(MSG.review),
      [NotificationType.ExpenditureReadyForFunding]: formatText(MSG.funding),
      [NotificationType.ExpenditureReadyForRelease]: formatText(MSG.release),
      [NotificationType.ExpenditureCancelled]: formatText(MSG.cancelled),
      [NotificationType.ExpenditureFinalized]: formatText(MSG.finalized),
      [NotificationType.ExpenditurePayoutClaimed]: formatText(
        MSG.payoutClaimed,
      ),
    }[notificationType];

    const secondPart =
      actionTitle || actionMetadataDescription || formatText(MSG.unknownAction);

    return (
      <>
        {firstPart} {secondPart}
      </>
    );
  }, [actionTitle, actionMetadataDescription, notificationType]);

  return <NotificationMessage loading={loading}>{Message}</NotificationMessage>;
};

ExpenditureNotificationMessage.displayName = displayName;

export default ExpenditureNotificationMessage;
