import React, { type ReactNode, useMemo, type FC } from 'react';
import { defineMessages } from 'react-intl';

import { NotificationType } from '~gql';
import { formatText } from '~utils/intl.ts';

import NotificationMessage from '../NotificationMessage.tsx';

const displayName =
  'common.Extensions.UserHub.partials.MultisigNotificationMessage';

interface MultisigNotificationMessageProps {
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
  unknownAction: {
    id: `${displayName}.unknownAction`,
    defaultMessage: 'Unknown multisig action',
  },
});

const MultisigNotificationMessage: FC<MultisigNotificationMessageProps> = ({
  actionMetadataDescription,
  actionTitle,
  loading,
  notificationType,
}) => {
  const Message = useMemo(() => {
    const firstPart = {
      [NotificationType.MultisigActionCreated]: formatText(MSG.created),
      [NotificationType.MultisigActionFinalized]: formatText(MSG.finalized),
      [NotificationType.MultisigActionApproved]: formatText(MSG.approved),
      [NotificationType.MultisigActionRejected]: formatText(MSG.rejected),
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

MultisigNotificationMessage.displayName = displayName;

export default MultisigNotificationMessage;
