import React, { useMemo, type FC, type ReactNode } from 'react';
import { defineMessages } from 'react-intl';

import { NotificationType } from '~gql';
import { formatText } from '~utils/intl.ts';

import NotificationMessage from '../NotificationMessage.tsx';

const displayName =
  'common.Extensions.UserHub.partials.ExpenditureMultiSigNotificationMessage';

interface ExpenditureFundingMultiSigNotificationMessageProps {
  actionMetadataDescription: ReactNode;
  actionTitle: string;
  loading: boolean;
  notificationType: NotificationType;
}

const MSG = defineMessages({
  created: {
    id: `${displayName}.created`,
    defaultMessage: 'Multi-sig decision:',
  },
  finalized: {
    id: `${displayName}.finalized`,
    defaultMessage: 'Finalized:',
  },
  approved: {
    id: `${displayName}.approved`,
    defaultMessage: 'Approved:',
  },
  rejected: {
    id: `${displayName}.rejected`,
    defaultMessage: 'Rejected:',
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

const ExpenditureFundingMultiSigNotificationMessage: FC<
  ExpenditureFundingMultiSigNotificationMessageProps
> = ({ actionTitle, actionMetadataDescription, loading, notificationType }) => {
  const Message = useMemo(() => {
    const firstPart = {
      [NotificationType.MultisigActionCreated]: formatText(MSG.created),
      [NotificationType.MultisigActionApproved]: formatText(MSG.approved),
      [NotificationType.MultisigActionRejected]: formatText(MSG.rejected),
      [NotificationType.MultisigActionFinalized]: formatText(MSG.finalized),
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

ExpenditureFundingMultiSigNotificationMessage.displayName = displayName;

export default ExpenditureFundingMultiSigNotificationMessage;
