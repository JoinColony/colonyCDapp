import React, { useMemo, type FC } from 'react';
import { defineMessages } from 'react-intl';

import { NotificationType } from '~gql';
import { type RequireProps } from '~types';
import { formatText } from '~utils/intl.ts';

import NotificationMessage from '../NotificationMessage.tsx';
import { type BaseNotificationMessageProps } from '../types.ts';

const displayName =
  'common.Extensions.UserHub.partials.MultisigNotificationMessage';

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

const MultisigNotificationMessage: FC<
  RequireProps<BaseNotificationMessageProps, 'notificationType'>
> = ({ actionMetadataDescription, actionTitle, loading, notificationType }) => {
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
